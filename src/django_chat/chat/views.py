from django.shortcuts import render
from chat.models import Room
from django.http import JsonResponse

def create_or_fetch_chat_room(request):
    # Extract parameters from the request
    id1 = request.GET.get('id1')
    id2 = request.GET.get('id2')

    print(f"Received request with id1: {id1}, id2: {id2}")

    if not all([id1, id2]):
        print("Missing parameters")
        return JsonResponse({"error": "Missing parameters"}, status=400)

    try:
        # Ensure consistent ordering
        if int(id1) > int(id2):
            id1, id2 = id2, id1

        room, created = Room.objects.get_or_create(
            id_friend1=int(id1),
            id_friend2=int(id2),
        )
        print(f"Room found or created: {room.id}")
        return JsonResponse({
            "room_id": room.id,
            "id_friend1": room.id_friend1,
            "id_friend2": room.id_friend2,
            "created": created,  # Return whether it was created
        })
    except Exception as e:
        print(f"Error creating or fetching room: {e}")
        return JsonResponse({"error": str(e)}, status=500)