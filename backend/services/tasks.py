from backend.core.celery_app import celery_app
import time

@celery_app.task(name="process_agent_training")
def process_agent_training(workspace_id: int):
    print(f"Starting agent training for workspace {workspace_id}...")
    time.sleep(5) # Simulate long running task
    print(f"Agent training for workspace {workspace_id} completed successfully.")
    return {"status": "success", "workspace_id": workspace_id}

@celery_app.task(name="cleanup_stale_sessions")
def cleanup_stale_sessions():
    print("Running scheduled cleanup of stale sessions...")
    return {"cleaned": True}
