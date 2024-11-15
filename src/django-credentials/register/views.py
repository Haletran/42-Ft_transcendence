import logging
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt


# Create your views here.

logger = logging.getLogger(__name__)

@csrf_exempt
def redirect_to_admin(request):
    logger.info("Redirecting to admin site from /api/register")
    return redirect('/')
