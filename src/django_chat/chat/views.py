from django.shortcuts import render
from chat.models import Room
from django.http import JsonResponse




def get_or_create_room(id1, name1, email1, id2, name2, email2):
    if id1 > id2:  # Ensure consistent ordering
        id1, id2 = id2, id1
        name1, name2 = name2, name1
        email1, email2 = email2, email1

    room, created = Room.objects.get_or_create(
        id_friend1=id1,
        id_friend2=id2,
        defaults={
            "name_friend1": name1,
            "email_friend1": email1,
            "name_friend2": name2,
            "email_friend2": email2,
        }
    )
    return room



def create_or_fetch_chat_room(request):
    # Extract parameters from the request
    id1 = request.GET.get('id1')
    name1 = request.GET.get('name1')
    email1 = request.GET.get('email1')
    id2 = request.GET.get('id2')
    name2 = request.GET.get('name2')
    email2 = request.GET.get('email2')

    if not all([id1, name1, email1, id2, name2, email2]):
        return JsonResponse({"error": "Missing parameters"}, status=400)

    room = get_or_create_room(
        int(id1), name1, email1,
        int(id2), name2, email2
    )

    return JsonResponse({
        "room_id": room.id,
        "id_friend1": room.id_friend1,
        "id_friend2": room.id_friend2,
        "created": True,  # You can enhance to return whether it was created
    })
