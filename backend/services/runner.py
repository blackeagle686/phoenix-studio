import io
import contextlib
import traceback
from typing import Dict, Any

async def run_agent_graph(graph: Dict[str, Any], user_message: str, session_id: str = "default") -> Dict[str, Any]:
    log_capture = io.StringIO()
    success = False
    response_msg = ""
    
    with contextlib.redirect_stdout(log_capture), contextlib.redirect_stderr(log_capture):
        try:
            print("--- Loading Framework Dependencies ---")
            try:
                from phoenix.framework.agent.tools.search import WebSearchTool
                from phoenix.framework.agent.tools.code import CommandExecutionTool
                from phoenix.framework.agent.core.agent import Agent
                from phoenix.framework.agent.tools.base import tool
            except ImportError as e:
                print(f"Error loading core framework: {e}")
                print("Make sure the core dependencies are installed in your environment.")
                return {
                    "response": f"System Error: {e}",
                    "logs": log_capture.getvalue(),
                    "success": False
                }

            nodes = graph.get("nodes", [])
            edges = graph.get("edges", [])

            # Find core nodes
            agent_node = next((n for n in nodes if n.get("type") == "agent"), None)
            chatbot_node = next((n for n in nodes if n.get("type") == "chatbot"), None)
            
            target_core_node = chatbot_node if chatbot_node else agent_node
            
            if not target_core_node:
                print("No Core Node (Agent or ChatBot) found in graph.")
                return {
                    "response": "No execution core found.",
                    "logs": log_capture.getvalue(),
                    "success": False
                }

            target_id = target_core_node.get("id")
            connected_sources = set()
            for edge in edges:
                if edge.get("target") == target_id:
                    connected_sources.add(edge.get("source"))

            scan_all = len(connected_sources) == 0

            # Scan nodes
            openai_llm_data = None
            local_llm_data = None
            use_hybrid_memory = False
            rag_data = None
            openai_vlm_data = None
            local_vlm_data = None
            tts_enabled = False
            stt_enabled = False
            tools = []
            
            for node in nodes:
                node_id = node.get("id")
                node_type = node.get("type")
                node_data = node.get("data", {})

                if node_id == target_id:
                    continue

                if node_id in connected_sources or scan_all:
                    if node_type == "openai_llm":
                        openai_llm_data = node_data
                    elif node_type == "local_llm":
                        local_llm_data = node_data
                    elif node_type == "hybrid_memory":
                        use_hybrid_memory = True
                    elif node_type == "default_tool":
                        t_type = node_data.get("tool_type")
                        if t_type == "web_search":
                            tools.append(WebSearchTool())
                        elif t_type == "command":
                            tools.append(CommandExecutionTool())
                    elif node_type == "custom_tool":
                        code = node_data.get("code", "")
                        fn_name = node_data.get("name", "custom_tool")
                        namespace = {'tool': tool}
                        exec(code, namespace)
                        if fn_name in namespace:
                            tools.append(namespace[fn_name])
                    elif node_type == "rag":
                        rag_data = node_data
                    elif node_type == "openai_vlm":
                        openai_vlm_data = node_data
                    elif node_type == "local_vlm":
                        local_vlm_data = node_data
                    elif node_type == "tts_node":
                        tts_enabled = True
                    elif node_type == "stt_node":
                        stt_enabled = True

            if chatbot_node:
                print("--- Initializing ChatBot from Graph ---")
                try:
                    from phoenix.framework.chatbot.core import ChatBot
                except ImportError as e:
                    print(f"Error loading chatbot framework: {e}")
                    raise

                c_data = chatbot_node.get("data", {})
                
                # Check explicit node toggles
                if c_data.get("tts_enabled"): tts_enabled = True
                if c_data.get("stt_enabled"): stt_enabled = True
                
                is_local = bool(local_llm_data) or not bool(openai_llm_data)
                vlm_enabled = bool(openai_vlm_data or local_vlm_data)

                builder = ChatBot(local=is_local, vlm=vlm_enabled, tts=tts_enabled, stt=stt_enabled)
                builder.with_system_prompt(c_data.get("system_prompt", "You are a helpful assistant."))
                builder.set_session(c_data.get("session_id", "default"))
                
                sec_mode = c_data.get("security_mode", "none")
                if sec_mode != "none":
                    builder.with_security(mode=sec_mode)
                    
                if use_hybrid_memory:
                    builder.with_memory()
                    
                if rag_data:
                    builder.with_rag(
                        data_to_insight_path=rag_data.get("path", "./data"),
                        chunk_size=rag_data.get("chunk_size", 500),
                        chunk_overlap=rag_data.get("chunk_overlap", 50)
                    )
                    
                if openai_llm_data:
                    builder.with_openai(
                        api_key=openai_llm_data.get("api_key", ""),
                        base_url=openai_llm_data.get("base_url") or None
                    )
                    builder.with_model(llm=openai_llm_data.get("model"))
                elif local_llm_data:
                    builder.with_model(llm=local_llm_data.get("model"))
                    
                if openai_vlm_data:
                    builder.with_model(vlm=openai_vlm_data.get("model"))
                    if not openai_llm_data:
                        builder.with_openai(api_key=openai_vlm_data.get("api_key", ""))
                elif local_vlm_data:
                    builder.with_model(vlm=local_vlm_data.get("model"))

                print("Building ChatBot instance...")
                bot = builder.build()
                
                print(f"\n--- Running ChatBot with message: '{user_message}' ---")
                response_msg = await bot.chat(text=user_message)
                success = True
                print("\n--- Execution Complete ---")

            elif agent_node:
                print("--- Initializing Agent from Graph ---")
                llm = None
                memory = None
                
                if openai_llm_data:
                    from phoenix.services.llm.openai import OpenAILLM
                    llm = OpenAILLM(
                        model=openai_llm_data.get("model") or "gpt-4o",
                        api_key=openai_llm_data.get("api_key") or "your-api-key",
                        base_url=openai_llm_data.get("base_url") or None
                    )
                elif local_llm_data:
                    from phoenix.services.llm.local import LocalLLM
                    llm = LocalLLM()
                    
                if use_hybrid_memory:
                    from phoenix.framework.agent.memory.hybrid import HybridMemory
                    memory = HybridMemory()

                agent = Agent(llm=llm, memory=memory)
                for t in tools:
                    agent.register_tool(t)
                    
                print(f"\n--- Running Agent with message: '{user_message}' ---")
                response_msg = await agent.run(user_message, session_id=agent_node.get("data", {}).get("session_id", "default"))
                success = True
                print("\n--- Execution Complete ---")
        except Exception as e:
            print("\n--- Execution Failed ---")
            traceback.print_exc()
            response_msg = f"Execution Error: {str(e)}"
            success = False
            
    return {
        "response": str(response_msg),
        "logs": log_capture.getvalue(),
        "success": success
    }
