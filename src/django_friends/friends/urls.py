from django.urls import path
from .views import add_friend, fetch_emails_from_credentials, get_friends_usernames

urlpatterns = [
    path('add/', add_friend, name='add_friend'),
    path('get_friends/', get_friends_usernames, name='get_friends'),
    path('fetch_emails/', fetch_emails_from_credentials, name='fetch_emails_from_credentials'),
]