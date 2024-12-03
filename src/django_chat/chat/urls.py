from django.urls import path
from chat.views import create_or_fetch_chat_room

urlpatterns = [
    path('api/create-or-fetch-chat-room/', create_or_fetch_chat_room, name='create_or_fetch_chat_room'),
]
