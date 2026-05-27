import os
from celery import Celery
from celery.schedules import crontab

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "phoenix_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["backend.services.tasks"]
)

celery_app.conf.update(
    result_expires=3600,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

celery_app.conf.beat_schedule = {
    'cleanup-every-midnight': {
        'task': 'cleanup_stale_sessions',
        'schedule': crontab(minute=0, hour=0),
    },
}
