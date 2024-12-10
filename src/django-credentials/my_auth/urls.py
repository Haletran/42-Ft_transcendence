from django.urls import path
from . import views
from .views import set_csrf_token, is_user_online
from .views import user_info, userid_info, unauthorized_user_info, logout_view, login_view, update_profile_view, login_42, check_user_view, print_all_emails, get42
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', login_view, name='login'),
    path('set-csrf-token/', set_csrf_token, name='set_csrf_token'),
    path('user-info/', user_info, name='user_info'),
    path('userid-info/', userid_info, name='userid_info'),
    path('logout/', logout_view, name='logout'),
    path('update_profile/', update_profile_view, name='update_profile'),
    path('check_user/', check_user_view, name='check_user'),
    path('debug/emails/', print_all_emails, name='print_all_emails'),
    path('callback/', login_42, name='login_42'),
    path('get42-info/', get42, name='get42'),
    path('is_online/', is_user_online, name='is_user_online'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
