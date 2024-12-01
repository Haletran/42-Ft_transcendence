from django.urls import path
from .views import add_friend, fetch_emails_from_credentials, get_friends_usernames, get_pending_confirmations, get_incoming_invitations

urlpatterns = [
    path('add/', add_friend, name='add_friend'),
    path('get_friends/', get_friends_usernames, name='get_friends'),
    path('fetch_emails/', fetch_emails_from_credentials, name='fetch_emails_from_credentials'),
    path('get_pending_confirmations/', get_pending_confirmations, name='get_pending_confirmations'),
    path('get_incoming_invitations/', get_incoming_invitations, name='get_incoming_invitations'),
]