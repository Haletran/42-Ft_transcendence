from rest_framework import serializers
from .models import Friend

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = [
            'id_friend1', 
            'name_friend1', 
            'email_friend1', 
            'id_friend2', 
            'name_friend2', 
            'email_friend2', 
            'sender', 
            'receiver', 
            'status'
        ]