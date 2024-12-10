from django.urls import path
from .views import add_friend, update_friend_username, fetch_emails_from_credentials, get_friends_usernames, get_pending_confirmations, get_incoming_invitations, handle_invitation_response, get_accepted_friendships

urlpatterns = [
    path('add/', add_friend, name='add_friend'),
    path('get_friends/', get_friends_usernames, name='get_friends'),
    path('fetch_emails/', fetch_emails_from_credentials, name='fetch_emails_from_credentials'),
    path('get_pending_confirmations/', get_pending_confirmations, name='get_pending_confirmations'),
    path('get_incoming_invitations/', get_incoming_invitations, name='get_incoming_invitations'),
    path('respond_invitation/', handle_invitation_response, name='handleInvitationResponse'),
    path('get_accepted_friendships/', get_accepted_friendships, name='get_accepted_friendships'),
    path('update_friend_username/', update_friend_username, name='update_friend_username'),
]