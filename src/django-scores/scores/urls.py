from django.urls import path
from .views import add_game, match_history, statistics, update_scores_username, clear_match_history

urlpatterns = [
    path('add_game/', add_game, name='add_game'),
    path('match_history/', match_history, name='match_history'),
    path('statistics/', statistics, name='statistics'),
    path('update_scores_username/', update_scores_username, name='update_scores_username'),
    path('clear_match_history/', clear_match_history, name='clear_match_history'),
]