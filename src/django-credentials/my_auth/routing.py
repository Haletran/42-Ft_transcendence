from django.urls import re_path
from .consumers import MyOnlineConsumer

websocket_urlpatterns = [
    re_path(r'ws/online-status/$', MyOnlineConsumer.as_asgi()),
]