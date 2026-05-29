import os
import multiprocessing

# Gunicorn configuration file

# Bind to host interface and port
bind = os.getenv("GUNICORN_BIND", "0.0.0.0:8010")

# Scale workers dynamically based on CPU core count
default_workers = (multiprocessing.cpu_count() * 2) + 1
workers = int(os.getenv("GUNICORN_WORKERS", default_workers))

# Use Uvicorn worker class for handling FastAPI asynchronously
worker_class = "uvicorn.workers.UvicornWorker"

# Increase timeout to accommodate long-running agent flows
timeout = int(os.getenv("GUNICORN_TIMEOUT", "120"))

# Standard streams redirection for container logs aggregation
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("GUNICORN_LOGLEVEL", "info")
keepalive = 5
