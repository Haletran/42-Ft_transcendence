from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
import json
from django.contrib.auth.models import User

@csrf_protect  # Temporarily disable CSRF for testing; in production, use proper CSRF tokens
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Create the user
            user = User.objects.create_user(username=email, email=email, password=password)

            return JsonResponse({'message': 'User registered successfully!'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)
