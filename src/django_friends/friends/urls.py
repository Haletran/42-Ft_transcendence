from django.urls import path
from .views import AddFriendView, print_all_emails

urlpatterns = [
    path('add/', AddFriendView.as_view(), name='add_friend'),
    path('debug/emails/', print_all_emails, name='print_all_emails'),
]