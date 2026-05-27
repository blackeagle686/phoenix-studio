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
            from phoenix.framework.agent.tools.search import WebSearchTool
            from phoenix.framework.agent.tools.code import CommandExecutionTool
            from phoenix.framework.agent.core.agent import Agent
            from phoenix.framework.agent.tools.base import tool

            nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])

    # Find agent node
    agent_node = next((n for n in nodes if n.get("type") == "agent"), None)
    
    connected_sources = set()
    if agent_node:
        agent_id = agent_node.get("id")
        for edge in edges:
            if edge.get("target") == agent_id:
                connected_sources.add(edge.get("source"))

    scan_all = len(connected_sources) == 0

    llm = None
    memory = None
    tools = []
    
    log_capture = io.StringIO()
    
    with contextlib.redirect_stdout(log_capture), contextlib.redirect_stderr(log_capture):
        try:
            print("--- Initializing Agent from Graph ---")
            for node in nodes:
                node_id = node.get("id")
                node_type = node.get("type")
                node_data = node.get("data", {})

                if node_type == "agent":
                    continue

                if node_id in connected_sources or scan_all:
                    if node_type == "openai_llm":
                        print(f"Initializing OpenAILLM ({node_data.get('model', 'gpt-4o')})...")
                        try:
                            from phoenix.services.llm.openai import OpenAILLM
                            llm = OpenAILLM(
                                model=node_data.get("model") or "gpt-4o",
                                api_key=node_data.get("api_key") or "your-api-key",
                                base_url=node_data.get("base_url") or None
                            )
                        except ImportError:
                            print("Warning: OpenAILLM dependencies not installed. Skipping.")
                    elif node_type == "local_llm":
                        print(f"Initializing LocalLLM ({node_data.get('model', 'Qwen')})...")
                        try:
                            from phoenix.services.llm.local import LocalLLM
                            llm = LocalLLM()
                        except ImportError:
                            print("Warning: LocalLLM dependencies not installed. Skipping.")
                    elif node_type == "hybrid_memory":
                        print("Initializing HybridMemory...")
                        try:
                            from phoenix.framework.agent.memory.hybrid import HybridMemory
                            memory = HybridMemory()
                        except ImportError:
                            print("Warning: HybridMemory dependencies (like torch) not installed. Skipping.")
                    elif node_type == "default_tool":
                        t_type = node_data.get("tool_type")
                        if t_type == "web_search":
                            print("Registering WebSearchTool...")
                            tools.append(WebSearchTool())
                        elif t_type == "command":
                            print("Registering CommandExecutionTool...")
                            tools.append(CommandExecutionTool())
                    elif node_type == "custom_tool":
                        code = node_data.get("code", "")
                        fn_name = node_data.get("name", "custom_tool")
                        print(f"Compiling custom tool: {fn_name}...")
                        namespace = {'tool': tool}
                        exec(code, namespace)
                        if fn_name in namespace:
                            tools.append(namespace[fn_name])
                        else:
                            print(f"Warning: Could not find function {fn_name} after compiling custom tool code.")

            print("Creating Agent instance...")
            agent = Agent(llm=llm, memory=memory)
            for t in tools:
                agent.register_tool(t)
                
            print(f"\n--- Running Agent with message: '{user_message}' ---")
            # The agent.run method must be awaited
            response = await agent.run(user_message, session_id=session_id)
            success = True
            print("\n--- Execution Complete ---")
        except Exception as e:
            print("\n--- Execution Failed ---")
            traceback.print_exc()
            response = f"Execution Error: {str(e)}"
            success = False
            
    return {
        "response": str(response),
        "logs": log_capture.getvalue(),
        "success": success
    }
