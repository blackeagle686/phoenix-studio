import io
import zipfile
import os
from jinja2 import Environment, FileSystemLoader
from backend.services.generator import generate_code

TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "chat_apps")
jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def package_project(graph: dict) -> io.BytesIO:
    # 1. Generate core logic
    bot_py_content = generate_code(graph)

    # 2. Extract configuration
    template_type = graph.get("template_type", "raw")
    gradient_colors = graph.get("gradient_colors", ["#ff00cc", "#333399"])
    theme_mode = graph.get("theme_mode", "dark")
    
    # 3. Extract API keys for .env
    nodes = graph.get("nodes", [])
    env_lines = []
    
    # Scan for openai_llm and openai_vlm to extract keys
    for node in nodes:
        if node.get("type") in ["openai_llm", "openai_vlm"]:
            data = node.get("data", {})
            api_key = data.get("api_key")
            base_url = data.get("base_url")
            if api_key and f"OPENAI_API_KEY={api_key}" not in env_lines:
                env_lines.append(f"OPENAI_API_KEY={api_key}")
            if base_url and f"OPENAI_BASE_URL={base_url}" not in env_lines:
                env_lines.append(f"OPENAI_BASE_URL={base_url}")
            
    # Create in-memory ZIP file
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED, False) as zip_file:
        
        if template_type == "raw":
            # Backward compatibility / raw export
            zip_file.writestr("main.py", bot_py_content)
            requirements = "# Phoenix SDK Agent Dependencies\nphx-ashborn[full]>=1.0.0\nopenai>=1.0.0\npython-dotenv>=1.0.0\n"
            zip_file.writestr("requirements.txt", requirements)
            zip_file.writestr(".env", "\n".join(env_lines) + "\n")
            
        else:
            # Full Web App Export
            # backend/bot.py
            zip_file.writestr("backend/bot.py", bot_py_content)
            
            # backend/server.py
            server_template = jinja_env.get_template("fastapi_server.py.jinja")
            server_py_content = server_template.render()
            zip_file.writestr("backend/server.py", server_py_content)
            
            # frontend/index.html
            html_template_name = "full_screen.html.jinja" if template_type == "full_screen" else "widget.html.jinja"
            html_template = jinja_env.get_template(html_template_name)
            index_html_content = html_template.render(
                gradient_colors=gradient_colors,
                theme_mode=theme_mode
            )
            zip_file.writestr("frontend/index.html", index_html_content)
            
            # requirements.txt
            requirements = (
                "# Phoenix Web App Dependencies\n"
                "phx-ashborn[full]>=1.0.0\n"
                "fastapi>=0.100.0\n"
                "uvicorn>=0.23.0\n"
                "python-multipart>=0.0.6\n"
                "sqlalchemy>=2.0.0\n"
                "passlib[bcrypt]>=1.7.4\n"
                "pyjwt>=2.8.0\n"
                "openai>=1.0.0\n"
                "python-dotenv>=1.0.0\n"
            )
            zip_file.writestr("requirements.txt", requirements)
            
            # .env
            zip_file.writestr(".env", "\n".join(env_lines) + "\n")
            
            # README.md
            readme = (
                "# Phoenix AI Full-Stack App\n\n"
                "Welcome to your generated AI Chat application!\n"
                "This project contains a fully functional FastAPI backend, an SQLite database for chat history, "
                "and a stunning responsive frontend.\n\n"
                "## Quick Start\n\n"
                "The easiest way to run your app is to use the provided run scripts:\n\n"
                "- **Windows:** Double-click `run.bat` or run it in the terminal.\n"
                "- **Mac/Linux:** Run `bash run.sh` in your terminal.\n\n"
                "## Manual Setup\n\n"
                "If you prefer to run it manually:\n"
                "1. Create and activate a Python virtual environment (recommended).\n"
                "2. Install dependencies: `pip install -r requirements.txt`\n"
                "3. Start the server: `python backend/server.py`\n\n"
                "Your web application will be available at: **http://localhost:8080**\n"
            )
            zip_file.writestr("README.md", readme)
            
            # run.sh (Linux/Mac)
            run_sh = (
                "#!/bin/bash\n"
                "echo \"[*] Installing dependencies...\"\n"
                "pip install -r requirements.txt\n"
                "echo \"[*] Starting Phoenix FastAPI Server...\"\n"
                "python backend/server.py\n"
            )
            # 0o755 permissions for bash script
            info_sh = zipfile.ZipInfo("run.sh")
            info_sh.external_attr = 0o755 << 16
            zip_file.writestr(info_sh, run_sh)
            
            # run.bat (Windows)
            run_bat = (
                "@echo off\n"
                "echo [*] Installing dependencies...\n"
                "pip install -r requirements.txt\n"
                "echo [*] Starting Phoenix FastAPI Server...\n"
                "python backend\\server.py\n"
                "pause\n"
            )
            zip_file.writestr("run.bat", run_bat)

    zip_buffer.seek(0)
    return zip_buffer
