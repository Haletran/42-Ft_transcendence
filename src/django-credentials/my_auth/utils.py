from datetime import timedelta
from django.utils.timezone import now

def is_user_active(user):
    if user.last_active:
        return now() - user.last_active <= timedelta(seconds=30)
    return False