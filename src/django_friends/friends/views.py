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
    id_friend1 = request.data.get('id_friend1')
    email_friend1 = request.data.get('email_friend1')
    name_friend1 = request.data.get('name_friend1')
    id_friend2 = request.data.get('id_friend2')
    email_friend2 = request.data.get('email_friend2')
    name_friend2 = request.data.get('name_friend2')
    sender = request.data.get('sender')
    receiver = request.data.get('receiver')
    status = request.data.get('status', 'pending')
    
    if not id_friend1 or not email_friend1 or not name_friend1 or not id_friend2 or not email_friend2 or not name_friend2 or not sender or not receiver:
        return Response({
            "error": "All fields are required"
        }, status=400)
        
    print(f"Processing friend request from {name_friend1} to {name_friend2}")
    
    # Create friend relationship
    friend_instance = Friend.objects.create(
        id_friend1=id_friend1,
        name_friend1=name_friend1,
        email_friend1=email_friend1,
        id_friend2=id_friend2,
        name_friend2=name_friend2,
        email_friend2=email_friend2,
        sender=sender,
        receiver=receiver,
        status=status
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
def get_pending_confirmations(request):
    user_id = request.query_params.get('user_id')

    if not user_id:
        return Response({
            "error": "User ID is required"
        }, status=400)

    try:
        # Get pending friend requests where the sender is the current user
        pending_requests = Friend.objects.filter(sender=user_id, status='pending')
        pending_confirmations = [{'receiver_username': req.name_friend2} for req in pending_requests]

        return Response({
            "sender": user_id,
            "pending_confirmations": pending_confirmations
        }, status=200)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)
    
@api_view(['GET'])
@csrf_exempt
def get_incoming_invitations(request):
    user_id = request.query_params.get('user_id')

    if not user_id:
        return Response({
            "error": "User ID is required"
        }, status=400)

    try:
        # Get pending friend requests where the sender is the current user
        pending_requests = Friend.objects.filter(receiver=user_id, status='pending')
        pending_confirmations = [{'receiver_username': req.name_friend2} for req in pending_requests]

        return Response({
            "sender": user_id,
            "pending_confirmations": pending_confirmations
        }, status=200)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)