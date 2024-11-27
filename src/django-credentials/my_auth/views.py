from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie, csrf_exempt
import json
# from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth import update_session_auth_hash
from django.db import transaction
from .models import MyUser
import requests
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.decorators import api_view #To delete after tests
import json
from django.contrib.auth import get_user_model

@ensure_csrf_cookie
def set_csrf_token(request):
    csrf_token = get_token(request)
    response = JsonResponse({'message': 'CSRF token set'})
    response['X-CSRFToken'] = csrf_token
    print(response)
    return response

def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            profile_picture = data.get('profile_picture')

            #if MyUser.objects.filter(email=email).exists():
            #    return JsonRespons({'error': 'Email already registered'}, status=400)
            # Create the user
            user = MyUser.objects.create_user(username=email, email=email, password=password, profile_picture=profile_picture)
            login(request, user)
            response = JsonResponse({'message': 'User registered successfully!'}, status=201)
            return response

        except ValidationError as e:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)

def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
        
            user = authenticate(request, username=email, password=password)
            print(user)
            if user is not None:
                login(request, user)
                return JsonResponse({"status": "success", "message": "Login successful"})
            else:
                return JsonResponse({"status": "error", "message": "Invalid email or password"}, status=400)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)

@login_required
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        response = JsonResponse({'message': 'Successfully logged out'}, status=200)
        response.delete_cookie('sessionid')
        return response
    return JsonResponse({'error': 'Invalid request method (logging out)'}, status=405)

@login_required
def user_info(request):
    # print(user)
    user = request.user
    return JsonResponse({
        'id' : user.id,
        'email': user.email,
        'profile_picture': user.profile_picture
    })

def unauthorized_user_info(request):
    return JsonResponse({'error': 'Unauthorized'}, status=401)

@login_required
@transaction.atomic
def update_profile_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            NewEmail = data.get('email')
            NewPassword = data.get('password')
            NewProfile_picture = data.get('profile_picture')

            user = MyUser.objects.get(username=request.user.username)
            
            if NewEmail:
                user.email = NewEmail
            if NewPassword:
                user.set_password(NewPassword)
            if NewProfile_picture:
                user.profile_picture = NewProfile_picture
            user.save()
            update_session_auth_hash(request, user)

            return JsonResponse({'status': 'success', 'message': 'Profile successfully updated'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=405)

@csrf_exempt
def check_user_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            print(f"Received username: {username}")  # Log the username
            User = get_user_model()
            if User.objects.filter(username=username).exists():
                print(f"User {username} exists in the database")  # Log if user exists
                return JsonResponse({"status": "success", "message": "User exists"})
            else:
                print(f"User {username} not found in the database")  # Log if user not found
                return JsonResponse({"status": "error", "message": "User not found"}, status=404)
        except Exception as e:
            print(f"Error occurred: {str(e)}")  # Log any exceptions
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)



@api_view(['GET'])
@csrf_exempt
def print_all_emails(request):
    User = get_user_model()
    emails = MyUser.objects.values_list('email', flat=True)
    usernames = MyUser.objects.values_list('username', flat=True)
    user_ids = MyUser.objects.values_list('id', flat=True)
    
    print("Emails in the database:")
    for email in emails:
        print(email)
    print("Usernames in the database:")
    for username in usernames:
        print(username)
    print("IDs:")
    for user_id in user_ids:
        print(user_id)
        
    return Response({
        "emails": list(emails), 
        "usernames": list(usernames), 
        "id": list(user_ids)  # Ensure 'id' key is present
    })

def login_42(request):
    code = request.GET.get('code')
    if not code:
        return JsonResponse({'error': 'No code'}, status=400)
    try:
        response = requests.post("https://api.intra.42.fr/oauth/token", data={
            'grant_type': 'authorization_code',
            'client_id': 'u-s4t2ud-24552aea517bf1496668f819d1dabbc2c0eb6d12a3e9c5e75a16a6b41738819c',
            'client_secret': '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',
            'redirect_uri': 'http://10.12.249.15:9000/api/callback',
            'code': code,
        })
        response_data = response.json()
        access_token = response_data.get('access_token')
        if not access_token:
            raise Exception("No access token")
        me_response = requests.get("https://api.intra.42.fr/v2/me", headers={
            'Authorization': f'Bearer {access_token}'
        })
        if me_response.status_code != 200:
            raise Exception("Invalid token")
        me_data = me_response.json()

        NewEmail = me_data.get('email')
        NewPassword = "NULL"
        NewProfile_picture = me_data.get('image', {}).get('versions', {}).get('medium', "NULL")

        user, created = MyUser.objects.get_or_create(username=NewEmail, defaults={
            'email': NewEmail,
            'profile_picture': NewProfile_picture,
        })

        if not created:
            if NewEmail:
                user.email = NewEmail
            if NewPassword:
                user.set_password(NewPassword)
            if NewProfile_picture:
                user.profile_picture = NewProfile_picture
            user.save()
        login(request, user)
        return redirect('https://10.12.249.15/home')
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)