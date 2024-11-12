from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer
from django.contrib.auth.models import User  # Import User model
import json, logging

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

def index(request):
    return render(request, 'index.html')

logger = logging.getLogger(__name__)

@csrf_exempt  # Use this for demonstration; CSRF tokens should be used in production
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Create the user
            user = User.objects.create_user(username=email, email=email, password=password)

            # Log successful registration
            logger.info(f"User {email} registered successfully.")
            return JsonResponse({'message': 'User registered successfully!'}, status=201)

        except json.JSONDecodeError:
            logger.error("Invalid JSON received.")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"Error during registration: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)