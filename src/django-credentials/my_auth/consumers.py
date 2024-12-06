import json
# from .models import MyUser
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils.timezone import now

class MyOnlineConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from .models import MyUser
        self.user = self.scope['user']

        if self.user.is_authenticated:
#            self.user.is_online = True
            await self.set_user_online()
            await self.accept()
    
    async def disconnect(self, close_code):
        from .models import MyUser
        if self.user.is_authenticated:
            await self.set_user_offline()
    
    async def receive(self, text_data):
        from .models import MyUser
        if self.user.is_authenticated:
            await self.update_last_active()

    @database_sync_to_async
    def set_user_online(self):
        from .models import MyUser
        self.user.is_online = True
        self.user.last_active = now()
        self.user.save()
    
    @database_sync_to_async
    def set_user_offline(self):
        from .models import MyUser
        self.user.is_online = False
        self.user.last_active = now()
        self.user.save()
    
    @database_sync_to_async
    def update_last_active(self):
        from .models import MyUser
        self.user.last_active = now()
        self.user.save()