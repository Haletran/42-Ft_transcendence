from django.db import models

class Friend(models.Model):
    name = models.CharField(max_length=100)  # A string field to store the name
    email = models.EmailField(unique=True)   # Email field, unique for each friend

    def __str__(self):
        return self.name