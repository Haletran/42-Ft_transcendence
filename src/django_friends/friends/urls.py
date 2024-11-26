from django.urls import path
from .views import add_friend, fetch_emails_from_credentials

urlpatterns = [
    path('add/', add_friend, name='add_friend'),
    path('fetch_emails/', fetch_emails_from_credentials, name='fetch_emails_from_credentials'),
]