import os
from jinja2 import Environment, FileSystemLoader

# Setup jinja environment
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def generate_code(graph: dict) -> str:
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])

    # Find agent node
    agent_node = next((n for n in nodes if n.get("type") == "agent"), None)
    agent_name = "PhoenixAgent"
    session_id = "default"
    if agent_node:
        agent_data = agent_node.get("data", {})
        agent_name = agent_data.get("name") or agent_name
        session_id = agent_data.get("session_id") or session_id

    # Identify connections to the agent
    connected_sources = set()
    if agent_node:
        agent_id = agent_node.get("id")
        for edge in edges:
            if edge.get("target") == agent_id:
                connected_sources.add(edge.get("source"))

    # For user-friendliness, if no nodes are connected via edges, 
    # we fall back to scanning all nodes present on the canvas.
    scan_all = len(connected_sources) == 0

    use_openai_llm = False
    use_local_llm = False
    use_hybrid_memory = False
    openai_llm_data = None
    local_llm_data = None
    
    default_tools = []
    custom_tools = []

    for node in nodes:
        node_id = node.get("id")
        node_type = node.get("type")
        node_data = node.get("data", {})

        # Skip the agent node itself
        if node_type == "agent":
            continue

        # Check if connected or if we scan all
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

    # Render template
    template = jinja_env.get_template("agent.py.jinja")
    rendered_code = template.render(
        agent_name=agent_name,
        session_id=session_id,
        use_openai_llm=use_openai_llm,
        use_local_llm=use_local_llm,
        use_hybrid_memory=use_hybrid_memory,
        openai_llm=openai_llm_data,
        local_llm=local_llm_data,
        default_tools=default_tools,
        custom_tools=custom_tools
    )

    return rendered_code
