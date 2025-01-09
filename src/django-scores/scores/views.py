from django.shortcuts import render
from .models import Game
import requests, json
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.db import transaction

# Create your views here.

@ensure_csrf_cookie

def add_game(request):
    if request.method == 'POST':
        try:
            user_origin = request.POST.get('user_origin')
            player1_username = request.POST.get('player1_username')
            player2_username = request.POST.get('player2_username')
            result = request.POST.get('result')
            player1_score = request.POST.get('player1_score')
            player2_score = request.POST.get('player2_score')
            is_ai = request.POST.get('is_ai')
            is_tournament = request.POST.get('is_tournament')

            if not user_origin or not player1_username or not player2_username or not player1_score or not player2_score or not result or not is_ai or not is_tournament:
                return Response({
                    "error": "All fields are required"
                }, status=400)

            is_ai = is_ai.lower() == 'true' if is_ai else False
            is_tournament = is_tournament.lower() == 'true' if is_tournament else False

            new_game = Game.objects.create(
                user_origin=user_origin,
                player1_username=player1_username,
                player2_username=player2_username,
                result=result,
                player1_score=int(player1_score),
                player2_score=int(player2_score),
                is_ai=is_ai,
                is_tournament=is_tournament,
                is_pong=True
            )
            new_game.save()

            response = JsonResponse({'message': 'Game added successfully'}, status=200)
            return response

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)

def add_monopoly(request):
    if request.method == 'POST':
        try:
            user_origin = request.POST.get('user_origin')
            winner_username = request.POST.get('winner_username')
            winner_money = request.POST.get('winner_money')
            winner_properties = request.POST.get

            new_game = Game.objects.create(
                user_origin=user_origin,
                player1_username=winner_username,
                player2_username=winner_username,
                result=winner_username,
                player1_score=int(winner_money),
                player2_score=int(winner_properties),
                is_ai=False,
                is_tournament=False,
                is_pong=False
            )
            new_game.save()

            response = JsonResponse({'message': 'Game added successfully'}, status=200)
            return response

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)

def match_history(request):
    username = request.GET.get('username')
    if not username:
        return JsonResponse({'error': 'Username is required'}, status=400)

    matches = Game.objects.filter(
        user_origin=username
    ).values(
        'player1_username', 'player2_username', 'result', 'player1_score', 'player2_score', 'is_ai', 'is_tournament', 'is_pong' 
    )

    return JsonResponse(list(matches), safe=False)

def statistics(request):
    username = request.GET.get('username')
    if not username:
        return JsonResponse({'error': 'Username is required'}, status=400)

    try:
        matches_against_ai = Game.objects.filter(is_ai=True).filter(user_origin=username)
        total_matches = matches_against_ai.count()
        wins = matches_against_ai.filter(result=username).count()
        losses = total_matches - wins

        win_percentage = (wins / total_matches) * 100 if total_matches > 0 else 0

        return JsonResponse({
            'total_matches': total_matches,
            'wins': wins,
            'losses':losses,
            'rate': win_percentage
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def update_scores_username(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            oldusername = data.get('oldusername')
            newusername = data.get('newusername')

            with transaction.atomic():
                Game.objects.filter(user_origin=oldusername).update(user_origin=newusername)
            
            return JsonResponse({'status': 'success', 'message': 'Username updated successfully.'})

        except Game.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Old username not found.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=405)

def clear_match_history(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')

            print(f"Deleting match history for user: {username}")

            with transaction.atomic():
                deleted_count, _ = Game.objects.filter(user_origin=username).delete()

            if deleted_count > 0:
                return JsonResponse({'status': 'success', 'message': 'Match History cleared.'})
            else:
                return JsonResponse({'status': 'error', 'message': 'No records found matching the condition.'})

        except Game.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'username not found.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
            
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=405)