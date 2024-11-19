from django.urls import path
from . import views  # Import views from the same app
from .views import set_csrf_token

urlpatterns = [
    # Example URL pattern for register
    path('register/', views.register_view, name='register'),
    path('set-csrf-token/', set_csrf_token, name='set_csrf_token'),
]
