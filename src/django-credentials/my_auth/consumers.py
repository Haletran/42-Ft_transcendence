from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
import redis

HOST = 'redis'
PORT = 6379

redis_client = redis.StrictRedis(host=HOST, port=PORT, db=0)

class MyOnlineConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.user_id = str(user.id)
            await self.set_user_online(self.user_id)
            await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'user_id'):
            await self.set_user_offline(self.user_id)

    async def receive(self, text_data):
        pass

    async def set_user_online(self, user_id):
        redis_client.sadd("online_users", user_id)

    async def set_user_offline(self, user_id):
        redis_client.srem("online_users", user_id)
