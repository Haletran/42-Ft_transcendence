from django.db import models

class Friend(models.Model):
    name = models.CharField(max_length=100)  # A string field to store the name
    email = models.EmailField(unique=True)   # Email field, unique for each friend
    date_of_birth = models.DateField()       # Date field for the birthday
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the friend is created

    def __str__(self):
        return self.name