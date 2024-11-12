from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, index, register

router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('', views.index),  # Serve the SPA for the root
    path('register', views.index),  # Serve the SPA for register
    path('api/register/', register, name='register'),
    path('login', views.index),
    path('games', views.index),
    path('pong', views.index),
    # Add more routes here as necessary
]