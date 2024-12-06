from django.shortcuts import render
from .models import Game
import requests

# Create your views here.

@ensure_csrf_cookie

def add_game(request):
    user_origin = request.data.get('user_origin')
    player1_username = request.data.get('player1_username')
    player2_username = request.data.get('player1_username')
    player1_result = request.data.get('player1_result')
    player2_result = request.data.get('player2_result')
    player1_result = request.data.get('player1_result')
    player2_score = request.data.get('player2_score')
    is_ai = request.data.get('is_ai')
    is_tournament = request.data.get('is_tournament')

    if not user_origin or not player1_username or not player2_username or not player1_score or not player2_score or not player1_result or not player2_result or not is_ai or not is_tournament:
    return Response({
        "error": "All fields are required"
    }, status=400)

    new_game = Game.objects.add_game()
    new_game.user_origin = user_origin
    new_game.player1_username = player1_username
    new_game.player2_username = player1_username
    new_game.player1_result = player1_result
    new_game.player2_result = player2_result
    new_game.player1_result = player1_result
    new_game.player2_score = player2_score
    new_game.is_ai = is_ai
    new_game.is_tournament = is_tournament