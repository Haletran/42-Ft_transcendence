import requests
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Friend
from .serializers import FriendSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

class AddFriendView(generics.CreateAPIView):
    serializer_class = FriendSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username') 
        print(f"Searching for friend with username: {username}")

        # Check if the friend exists in the credentials database
        credentials_service_url = 'http://django-credentials:9000/api/check_user/'
        response = requests.post(credentials_service_url, json={'username': username})
        print(f"Response from credentials service: {response.status_code}, {response.json()}")

        if response.status_code != 200:
            return Response({"error": "Friend not found in credentials database"}, status=404)

        if Friend.objects.filter(name=username).exists():
            print(f"Friend with username {username} already exists in the Friend model")
            return Response({"error": "You are already friends with this user"}, status=400)

        try:
            friend = User.objects.get(username=username)
            print(f"Found user: {friend}")
        except User.DoesNotExist:
            print(f"User with username {username} does not exist")
            # Log all emails and usernames
            emails = User.objects.values_list('email', flat=True)
            usernames = User.objects.values_list('username', flat=True)
            print("Emails in the database:")
            for email in emails:
                print(email)
            print("Usernames in the database:")
            for username in usernames:
                print(username)
            return Response({"error": "User not found"}, status=404)

        friend_instance = Friend.objects.create(name=friend.username, email=friend.email, date_of_birth=friend.profile.date_of_birth)
        serializer = self.get_serializer(friend_instance)
        print(f"Created friend instance: {friend_instance}")
        return Response(serializer.data, status=201)

@api_view(['GET'])
@csrf_exempt
def print_all_emails(request):
    User = get_user_model()
    emails = User.objects.values_list('email', flat=True)
    usernames = User.objects.values_list('username', flat=True)
    print("Emails in the database:")
    for email in emails:
        print(email)
    print("Usernames in the database:")
    for username in usernames:
        print(username)
    return Response({"emails": list(emails), "usernames": list(usernames)})