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
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.exceptions import ObjectDoesNotExist
import os

from django.core.cache import cache
import redis
from .utils import is_user_active

HOST = 'redis'
PORT = 6379
redis_client = redis.StrictRedis(host=HOST, port=PORT, db=0)

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
            # data = json.loads(request.body)
            # email = data.get('email')
            # password = data.get('password')
            # profile_picture = data.get('profile_picture')

            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')
            # profile_picture = request.POST.get('profile_picture')
            uploaded_file = request.FILES.get('profile_picture')


        
            # Create the user
            user = MyUser.objects.create_user(email=email, username=username, password=password)
            if uploaded_file:
                print(f"Received file: {uploaded_file.name}")
                user.profile_picture = uploaded_file
                user.save()
                print(f"File saved: {user.profile_picture.url}")
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
            username = data.get('username')
            password = data.get('password')

        
            user = authenticate(request, username=username, password=password)
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
    try:
        user = request.user
        profile_picture_url = user.profile_picture.url if user.profile_picture else None
        return JsonResponse({
            'id' : user.id,
            'email': user.email,
            'username': user.username,
            'profile_picture': profile_picture_url,
        })
    except ObjectDoesNotExist:
        return JsonResponse({
            "error": "User not found."
        }, status=404)

@login_required
def userid_info(request):
    username = request.GET.get('user')

    if not username:
        return JsonResponse({
            "error": "Username parameter is required."
        }, status=400)

    try:
        user = MyUser.objects.get(username=username)
        profile_picture_url = user.profile_picture.url if user.profile_picture else None

        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'profile_picture': profile_picture_url
        })

    except ObjectDoesNotExist:
        return JsonResponse({
            "error": "User not found."
        }, status=404)

def unauthorized_user_info(request):
    return JsonResponse({'error': 'Unauthorized'}, status=401)

@login_required
def update_profile_view(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')
            uploaded_file = request.FILES.get('profile_picture')
            with transaction.atomic():
                user = MyUser.objects.select_for_update().get(username=request.user.username)
            
            if email:
                user.email = email
            if username:
                oldusername = user.username
                user.username = username
                # update the friend
                try:
                    csrf_token = get_token(request)
                    friend_data = { 'oldusername': oldusername, 'newusername': username }
                    session = requests.Session()
                    session.headers.update({'Content-Type': 'application/json', 'X-CSRFToken': csrf_token})
                    session.cookies.set('csrftoken', csrf_token)
                    friend_response = session.post('http://django-friends:9001/api/friends/update_friend_username/',
                        data=json.dumps(friend_data)
                    )
                    scores_response = session.post('http://django-scores:9003/api/scores/update_scores_username/',
                        data=json.dumps(friend_data)
                    )

                    friend_response.raise_for_status()
                    scores_response.raise_for_status()

                except Exception as e:
                    return JsonResponse({'status': 'error updating other dbs', 'message': str(e)})

            if password:
                user.set_password(password)
            if uploaded_file:
                print(f"Received file: {uploaded_file.name}")
                user.profile_picture = uploaded_file
                print(f"File saved: {user.profile_picture.url}")
            user.save()
            update_session_auth_hash(request, user)
            cache.delete(f"user_{user.pk}")
            # update_session_auth_hash(request, user)

            user_data = {
                'username': user.username,
                'email': user.email,
                'profile_picture': user.profile_picture.url if user.profile_picture else None,
            }

            return JsonResponse({'status': 'success', 'message': 'Profile successfully updated', 'user': user_data})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=405)

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
            'client_id': os.getenv('CLIENT_ID'),
            'client_secret': os.getenv('CLIENT_SECRET'),
            'redirect_uri': os.getenv('REDIRECT_URI'),
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

        NewUsername = me_data.get('login')
        NewEmail = me_data.get('email')
        NewPassword = "NULL"
        NewProfile_picture = me_data.get('image', {}).get('versions', {}).get('medium', "NULL")

        user, created = MyUser.objects.get_or_create(username=NewUsername, email=NewEmail, defaults={
            'email': NewEmail,
            # 'profile_picture': NewProfile_picture,
        })

       # if created or NewProfile_picture:
        if NewProfile_picture:
            pic_response = requests.get(NewProfile_picture)
            pic_response.raise_for_status()

            file_name = f"profile_pics/{NewUsername}_profile.jpg"
            file_path = default_storage.save(file_name, ContentFile(pic_response.content))

            user.profile_picture = file_path
            user.save()

        if not created:
            if NewEmail:
                user.email = NewEmail
            if NewPassword:
                user.set_password(NewPassword)
            if NewUsername:
                user.username = NewUsername              
            if NewProfile_picture:
                pic_response = requests.get(NewProfile_picture)
                pic_response.raise_for_status()
                file_name = f"profile_pics/{NewUsername}_profile.jpg"
                file_path = default_storage.save(file_name, ContentFile(pic_response.content))
                user.profile_picture = file_path
            user.save()
        login(request, user)
        return redirect('https://192.168.122.131/home')
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def get42(request):
    client_id = os.getenv('CLIENT_ID')
    redirect_uri = os.getenv('REDIRECT_URI')
    url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    return JsonResponse({"url": url})

@login_required
def is_user_online(request):
    try:
        user = MyUser.objects.get(username=request.user.username)

        friend_username = request.GET.get('user')
        if not friend_username:
            is_online = redis_client.sismember("online_users", user.id)
        else:
            try:
                friend = MyUser.objects.get(username=friend_username)
                is_online = redis_client.sismember("online_users", friend.id)
            except MyUser.DoesNotExist:
                return JsonResponse({'error': 'Friend not found'}, status=404)

        return JsonResponse({'is_online': is_online})

    except MyUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except redis.exceptions.ConnectionError:
        return JsonResponse({'error': 'Redis connection failed'}, status=500)
    except Exception as e:
        return JsonResponse({'error': 'Error fetching online status'}, status=400)
