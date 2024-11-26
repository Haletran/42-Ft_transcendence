from django.urls import path
from . import views  # Import views from the same app
from .views import set_csrf_token
from .views import user_info, unauthorized_user_info, logout_view, login_view, update_profile_view, login_42

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', login_view, name='login'),
    path('set-csrf-token/', set_csrf_token, name='set_csrf_token'),
    path('user-info/', user_info, name='user_info'),
    path('logout/', logout_view, name='logout'),
    path('update_profile/', update_profile_view, name='update_profile'),
    path('callback/', login_42, name='login_42'),
]
