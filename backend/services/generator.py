import os
from jinja2 import Environment, FileSystemLoader

# Setup jinja environment
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def generate_code(graph: dict) -> str:
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])

    # Find core nodes
    agent_node = next((n for n in nodes if n.get("type") == "agent"), None)
    chatbot_node = next((n for n in nodes if n.get("type") == "chatbot"), None)

    # Determine main target node
    target_core_node = chatbot_node if chatbot_node else agent_node
    
    if not target_core_node:
        return "# No Core Node (Agent or ChatBot) found in graph."

    target_id = target_core_node.get("id")
    target_data = target_core_node.get("data", {})

    # Find specialized nodes
    rag_node = next((n for n in nodes if n.get("type") == "rag"), None)
    api_export_node = next((n for n in nodes if n.get("type") == "api_export"), None)

    # Identify connected sources to the main node
    connected_sources = set()
    for edge in edges:
        if edge.get("target") == target_id:
            connected_sources.add(edge.get("source"))

    # Identify connected sources to RAG
    rag_sources = set()
    if rag_node:
        for edge in edges:
            if edge.get("target") == rag_node.get("id"):
                rag_sources.add(edge.get("source"))

    # Check for API Export connection
    export_as_api = False
    api_export_key = "my_secure_api_key"
    if api_export_node and chatbot_node:
        for edge in edges:
            if edge.get("source") == chatbot_node.get("id") and edge.get("target") == api_export_node.get("id"):
                export_as_api = True
                api_export_key = api_export_node.get("data", {}).get("api_key", "my_secure_api_key")

    scan_all = len(connected_sources) == 0

    # Base variables
    use_openai_llm = False
    use_local_llm = False
    use_hybrid_memory = False
    openai_llm_data = None
    local_llm_data = None
    default_tools = []
    custom_tools = []
    
    # Multimodal variables
    rag_data = None
    openai_vlm_data = None
    local_vlm_data = None
    tts_enabled = False
    stt_enabled = False

    for node in nodes:
        node_id = node.get("id")
        node_type = node.get("type")
        node_data = node.get("data", {})

        if node_id == target_id:
            continue

        if node_id in connected_sources or scan_all:
            if node_type == "openai_llm":
                use_openai_llm = True
                openai_llm_data = {
                    "model": node_data.get("model") or "gpt-4o",
                    "api_key": node_data.get("api_key") or "your-api-key-here",
                    "base_url": node_data.get("base_url") or ""
                }
            elif node_type == "local_llm":
                use_local_llm = True
                local_llm_data = {
                    "model": node_data.get("model") or "Qwen/Qwen2-1.5B-Instruct"
                }
            elif node_type == "hybrid_memory":
                use_hybrid_memory = True
            elif node_type == "default_tool":
                default_tools.append({
                    "name": node_data.get("name") or "web_search",
                    "type": node_data.get("tool_type") or "web_search"
                })
            elif node_type == "custom_tool":
                custom_tools.append({
                    "name": node_data.get("name") or "my_custom_tool",
                    "code": node_data.get("code") or (
                        "@tool(name=\"my_custom_tool\", description=\"Custom action.\")\n"
                        "def my_custom_tool(param: str):\n"
                        "    return f\"Processed {param}\""
                    )
                })
            elif node_type == "rag":
                rag_data = {
                    "path": node_data.get("path") or "./data",
                    "chunk_size": node_data.get("chunk_size") or 500,
                    "chunk_overlap": node_data.get("chunk_overlap") or 50,
                    "reranking": node_data.get("reranking") or False,
                    "fast_rag": node_data.get("fast_rag") or False,
                    "hybrid_search": node_data.get("hybrid_search") or False,
                    "cag": node_data.get("cag") or False,
                    "threshold": node_data.get("threshold") or 0.5,
                    "device": node_data.get("device") or "cpu"
                }
            elif node_type == "openai_vlm":
                openai_vlm_data = {
                    "model": node_data.get("model") or "gpt-4o",
                    "api_key": node_data.get("api_key") or "your-api-key-here"
                }
            elif node_type == "local_vlm":
                local_vlm_data = {
                    "model": node_data.get("model") or "Qwen/Qwen2-VL-7B-Instruct"
                }
            elif node_type == "tts_node":
                tts_enabled = True
            elif node_type == "stt_node":
                stt_enabled = True

        # Handle specialized data sources connected to RAG
        if node_id in rag_sources:
            if node_type in ["github_repo", "web_data_api"]:
                if "data_sources" not in locals(): data_sources = []
                data_sources.append(node_data.get("url") or "https://github.com/blackeagle686/phx-quantum")
            elif node_type == "data_folder":
                if "data_sources" not in locals(): data_sources = []
                data_sources.append(node_data.get("path") or "./data")
            elif node_type == "data_source": # Backward compatibility
                if "data_sources" not in locals(): data_sources = []
                data_sources.append(node_data.get("path") or "./data")

    if rag_data and "data_sources" in locals() and data_sources:
        rag_data["path"] = data_sources if len(data_sources) > 1 else data_sources[0]

    # Override TTS/STT if set explicitly on chatbot node
    if chatbot_node:
        if target_data.get("tts_enabled"): tts_enabled = True
        if target_data.get("stt_enabled"): stt_enabled = True

    if chatbot_node:
        template = jinja_env.get_template("chatbot.py.jinja")
        rendered_code = template.render(
            is_local=use_local_llm or not use_openai_llm,
            vlm_enabled=bool(openai_vlm_data or local_vlm_data),
            tts_enabled=tts_enabled,
            stt_enabled=stt_enabled,
            session_id=target_data.get("session_id") or "default",
            system_prompt=target_data.get("system_prompt") or "You are a helpful assistant.",
            security_mode=target_data.get("security_mode") or "none",
            memory_enabled=use_hybrid_memory,
            rag=rag_data,
            openai_llm=openai_llm_data,
            local_llm=local_llm_data,
            openai_vlm=openai_vlm_data,
            local_vlm=local_vlm_data
        )
    else:
        template = jinja_env.get_template("agent.py.jinja")
        rendered_code = template.render(
            agent_name=target_data.get("name") or "PhoenixAgent",
            session_id=target_data.get("session_id") or "default",
            use_openai_llm=use_openai_llm,
            use_local_llm=use_local_llm,
            use_hybrid_memory=use_hybrid_memory,
            openai_llm=openai_llm_data,
            local_llm=local_llm_data,
            default_tools=default_tools,
            custom_tools=custom_tools
        )

    return rendered_code, export_as_api, api_export_key
