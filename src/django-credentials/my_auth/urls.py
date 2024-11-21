from django.urls import path
from . import views  # Import views from the same app
from .views import set_csrf_token
from .views import user_info, unauthorized_user_info

urlpatterns = [
    # Example URL pattern for register
    path('register/', views.register_view, name='register'),
    path('set-csrf-token/', set_csrf_token, name='set_csrf_token'),
    path('user-info/', user_info, name='user_info'),
]
