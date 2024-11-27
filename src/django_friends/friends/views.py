import requests
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Friend
from .serializers import FriendSerializer
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
@csrf_exempt
def add_friend(request):
    user_name = request.data.get('username')
    user_email = request.data.get('email')
    user_id = request.data.get('id')
    
    if not user_name or not user_email or not user_id:
        return Response({
            "error": "Username, email, and user ID are required"
        }, status=400)
        
    print(f"Processing friend request for username: {user_name}, email: {user_email}, id: {user_id}")
    
    # Create friend relationship
    friend_instance = Friend.objects.create(
        user_id=user_id,
        name=user_name,
        email=user_email
    )
    serializer = FriendSerializer(friend_instance)
    return Response(serializer.data, status=201)

@api_view(['GET'])
@csrf_exempt
def fetch_emails_from_credentials(request):
    emails_service_url = 'http://django-credentials:9000/api/debug/emails/'
    emails_response = requests.get(emails_service_url)
    if emails_response.status_code == 200:
        emails_data = emails_response.json()
        print("Emails in the credentials database:")
        for email in emails_data['emails']:
            print(email)
        print("Usernames in the credentials database:")
        for username in emails_data['usernames']:
            print(username)
        print("Id in the credentials database:")
        for id in emails_data['id']:
            print(id)
        return Response(emails_data)
    else:
        print(f"Failed to fetch emails from credentials service: {emails_response.status_code}")
        return Response({"error": "Failed to fetch emails from credentials service"}, status=emails_response.status_code)
    
@api_view(['GET'])
@csrf_exempt
def get_friends_usernames(request):
    user_id = request.query_params.get('user_id')
    
    if not user_id:
        return Response({
            "error": "User ID is required"
        }, status=400)
    
    try:
        friends = Friend.objects.filter(user_id=user_id)
        friends_usernames = [friend.name for friend in friends]
        
        return Response({
            "user_id": user_id,
            "friends_usernames": friends_usernames
        }, status=200)
    except Friend.DoesNotExist:
        return Response({
            "error": "No friends found for the given user ID"
        }, status=404)