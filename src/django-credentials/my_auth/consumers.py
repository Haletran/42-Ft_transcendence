from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timezone import now
from django_redis import get_redis_connection
import json

class MyOnlineConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']

        if self.user.is_authenticated:
            await self.set_user_online()
            await self.accept()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.set_user_offline()

    async def receive(self, text_data):
        if self.user.is_authenticated:
            await self.update_last_active()

    async def set_user_online(self):
        redis_conn = get_redis_connection("default")
        key = f"user:{self.user.id}:status"
        redis_conn.hmset(key, {
            "is_online": 1,
            "last_active": now().isoformat(),
        })
        redis_conn.expire(key, 3600)  # Set a 1-hour TTL to clean up stale keys

    async def set_user_offline(self):
        redis_conn = get_redis_connection("default")
        key = f"user:{self.user.id}:status"
        redis_conn.hmset(key, {
            "is_online": 0,
            "last_active": now().isoformat(),
        })

    async def update_last_active(self):
        redis_conn = get_redis_connection("default")
        key = f"user:{self.user.id}:status"
        redis_conn.hset(key, "last_active", now().isoformat())
        redis_conn.expire(key, 3600)  # Refresh TTL
