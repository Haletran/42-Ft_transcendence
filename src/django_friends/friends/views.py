import requests
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Friend, FriendRequest
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
    
@api_view(['GET'])
@csrf_exempt
def get_pending_invitations(request):
    user_id = request.query_params.get('user_id')
    
    if not user_id:
        return Response({
            "error": "User ID is required"
        }, status=400)
    
    try:
        # Get pending friend requests where the receiver is the current user
        pending_requests = FriendRequest.objects.filter(receiver=user_id, status='pending')
        pending_invitations = [{'sender_email': req.sender_mail} for req in pending_requests]
        
        return Response({
            "receiver": user_id,
            "pending_invitations": pending_invitations
        }, status=200)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)

@api_view(['POST'])
@csrf_exempt
def add_friend_request(request):
    sender_id = request.data.get('sender_id')
    receiver_id = request.data.get('receiver_id')
    currentUserEmail = request.data.get('sender_mail')

    if not sender_id or not receiver_id:
        return Response({
            "error": "Sender ID and Receiver ID are required"
        }, status=400)

    try:

        # Check if a friend request already exists
        if FriendRequest.objects.filter(sender=sender_id, receiver=receiver_id, sender_mail = currentUserEmail).exists():
            return Response({
                "error": "Friend request already exists"
            }, status=400)

        # Create a new friend request
        friend_request = FriendRequest.objects.create(sender=sender_id, receiver=receiver_id, sender_mail = currentUserEmail)
        return Response({
            "message": "Friend request sent successfully",
            "friend_request_id": friend_request.id
        }, status=201)
    except Friend.DoesNotExist:
        return Response({
            "error": "Sender or Receiver not found"
        }, status=404)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)