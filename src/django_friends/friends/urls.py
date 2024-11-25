from django.urls import path
from .views import AddFriendView

urlpatterns = [
    path('add/', AddFriendView.as_view(), name='add_friend'),
]