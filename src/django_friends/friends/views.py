from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Friend
from .serializers import FriendSerializer
from django.contrib.auth.models import User

class AddFriendView(generics.CreateAPIView):
    serializer_class = FriendSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        friend_username = request.data.get('friend_username')

        try:
            friend = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"error": "Friend not found"}, status=404)

        if Friend.objects.filter(user=user, friend=friend).exists():
            return Response({"error": "You are already friends with this user"}, status=400)

        friend_instance = Friend.objects.create(user=user, friend=friend)
        serializer = self.get_serializer(friend_instance)
        return Response(serializer.data, status=201)

