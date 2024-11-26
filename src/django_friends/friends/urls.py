from django.urls import path
from .views import add_friend, print_all_emails, fetch_emails_from_credentials

urlpatterns = [
    path('add/', add_friend, name='add_friend'),
    path('debug/emails/', print_all_emails, name='print_all_emails'),
    path('fetch_emails/', fetch_emails_from_credentials, name='fetch_emails_from_credentials'),
]