from django.urls import path
from .views import add_game, match_history, statistics

urlpatterns = [
    path('add_game/', add_game, name='add_game'),
    path('match_history/', match_history, name='match_history'),
    path('statistics/', statistics, name='statistics',)
]