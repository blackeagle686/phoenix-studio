import io
import zipfile
from backend.services.generator import generate_code

def package_project(graph: dict) -> io.BytesIO:
    # 1. Generate code
    main_py_content = generate_code(graph)

    # 2. Extract API keys for .env
    nodes = graph.get("nodes", [])
    env_lines = []
    
    # Scan for openai_llm
    openai_node = next((n for n in nodes if n.get("type") == "openai_llm"), None)
    if openai_node:
        openai_data = openai_node.get("data", {})
        api_key = openai_data.get("api_key") or ""
        base_url = openai_data.get("base_url") or ""
        
        env_lines.append(f"OPENAI_API_KEY={api_key}")
        if base_url:
            env_lines.append(f"OPENAI_BASE_URL={base_url}")
            
    # requirements.txt content
    requirements_content = (
        "# Phoenix SDK Agent Dependencies\n"
        "phx-ashborn[full]>=1.0.0\n"
        "openai>=1.0.0\n"
        "python-dotenv>=1.0.0\n"
    )

    # Create in-memory ZIP file
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
        # Write main.py
        zip_file.writestr("main.py", main_py_content)
        # Write requirements.txt
        zip_file.writestr("requirements.txt", requirements_content)
        # Write .env (empty if no values, otherwise keys)
        zip_file.writestr(".env", "\n".join(env_lines) + "\n")

    zip_buffer.seek(0)
    return zip_buffer
