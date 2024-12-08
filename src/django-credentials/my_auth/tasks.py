from celery import shared_task
from django.utils.timezone import now
from .models import MyUser
import redis
from django.conf import settings

@shared_task
def sync_online_status_to_db():
    redis_client = redis.StrictRedis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB
    )
    keys = redis_client.keys("user_status:*")
    for key in keys:
        user_id = key.decode().split(":")[1]
        status = redis_client.hgetall(key)
        if not status:
            continue
        user = MyUser.objects.filter(id=user_id).first()
        if user:
            user.is_online = status.get(b"is_online") == b"1"
            user.last_active = now()  # or parse the actual timestamp if stored
            user.save()
