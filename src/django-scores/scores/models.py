from django.db import models

# Create your models here.

class Game(models.model):
    user_origin = models.CharField(max_length=100)
    player1_username = models.CharField(max_length=100)
    player2_username = models.CharField(max_length=100)
    player1_result = models.CharField(max_length=6, choices=[('win'), ('defeat')])
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    is_ai = models.BooleanField(default=False)
    is_tournament = models.BooleanField(default=False)

    def add_game():
        Game.objects.create(
            user_origin = self.user_origin,
            player1_username = self.player1_username,
            player2_username = self.player1_username,
            player1_result = self.player1_result,
            player2_result = self.player2_result,
            player1_score = self.player1_score,
            player2_score = self.player2_score,
            is_ai = self.is_ai,
            is_tournament = self.is_tournament,
        )

    # def delete_game