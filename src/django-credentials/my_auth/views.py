from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
import json
# from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import MyUser

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

        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({"status": "success", "message": "Login successful"})
        else:
            return JsonResponse({"status": "error", "message": "Invalid email or password"})
    
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
    user = request.user
    return JsonResponse({
        'email': user.email,
        'profile_picture': user.profile_picture
    })

def unauthorized_user_info(request):
    return JsonResponse({'error': 'Unauthorized'}, status=401)

#@login_required
#LOGOUT
