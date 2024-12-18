from django.db import models

# Create your models here.

class Game(models.Model):
    user_origin = models.CharField(max_length=100)
    player1_username = models.CharField(max_length=100)
    player2_username = models.CharField(max_length=100)
    result = models.CharField(max_length=100)
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    is_ai = models.BooleanField(default=False)
    is_tournament = models.BooleanField(default=False)
    is_pong = models.BooleanField(default=False)