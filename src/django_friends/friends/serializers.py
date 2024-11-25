from rest_framework import serializers
from .models import Friend

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ['name', 'email', 'date_of_birth', 'created_at']