import requests
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Friend
from .serializers import FriendSerializer
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.db import models

@ensure_csrf_cookie

@api_view(['POST'])
# @csrf_exempt
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
# @csrf_exempt
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
# @csrf_exempt
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
# @csrf_exempt
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
# @csrf_exempt
def get_incoming_invitations(request):
    user_id = request.query_params.get('user_id')

    if not user_id:
        return Response({
            "error": "User ID is required"
        }, status=400)

    try:
        # Get pending friend requests where the receiver is the current user
        pending_requests = Friend.objects.filter(receiver=user_id, status='pending')
        pending_confirmations = [{'id': req.id, 'receiver_username': req.name_friend2} for req in pending_requests]

        return Response({
            "sender": user_id,
            "pending_confirmations": pending_confirmations
        }, status=200)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)
    
@api_view(['POST'])
# @csrf_exempt
def handle_invitation_response(request):
    invitation_id = request.query_params.get('id')
    choice = request.data.get('choice')

    if not invitation_id:
        return Response({
            "error": "Invitation ID is required"
        }, status=400)

    if choice not in ['accepted', 'rejected']:
        return Response({
            "error": "Choice must be either 'accepted' or 'rejected'"
        }, status=400)

    try:
        # Assuming the current user ID is available in the request (e.g., from a session or token)
        current_user_id = request.user.id

        # Get the friendship object
        friendship = Friend.objects.filter(id=invitation_id, status='pending').first()
        if not friendship:
            return Response({
                "error": "Pending invitation not found"
            }, status=404)

        # Change the status of the friendship
        friendship.change_status(friendship.id_friend2, choice)

        return Response({
            "message": f"Invitation {choice} successfully"
        }, status=200)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)
    
@api_view(['GET'])
def get_accepted_friendships(request):
    user_id = request.query_params.get('user_id')

    if not user_id:
        return Response({
            "error": "User ID is required"
        }, status=400)

    try:
        accepted_friendships = Friend.objects.filter(
            models.Q(id_friend1=user_id) | models.Q(id_friend2=user_id),
            status='accepted'
        )

        accepted_friendships_data = []
        for friendship in accepted_friendships:
            if friendship.id_friend1 == int(user_id):
                friend_username = friendship.name_friend2
            else:
                friend_username = friendship.name_friend1

            accepted_friendships_data.append({
                'id': friendship.id,
                'friend_username': friend_username
            })

        return Response({
            "accepted_friendships": accepted_friendships_data
        }, status=200)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)