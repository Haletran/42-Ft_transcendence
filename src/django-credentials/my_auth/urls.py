from django.urls import path
from . import views  # Import views from the same app

urlpatterns = [
    # Example URL pattern for register
    path('register/', views.register_view, name='register'),
]
