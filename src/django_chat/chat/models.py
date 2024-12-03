from django.db import models

class Room(models.Model):
    """
    Represents a private chat room between two users.
    """
    id_friend1 = models.IntegerField()  # User 1 ID
    name_friend1 = models.CharField(max_length=100)  # User 1 Name
    email_friend1 = models.EmailField()  # User 1 Email

    id_friend2 = models.IntegerField()  # User 2 ID
    name_friend2 = models.CharField(max_length=100)  # User 2 Name
    email_friend2 = models.EmailField()  # User 2 Email

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["id_friend1", "id_friend2"],
                name="unique_room"
            )
        ]

    def save(self, *args, **kwargs):
        # Ensure consistent order of friend IDs
        if self.id_friend1 > self.id_friend2:
            (
                self.id_friend1,
                self.id_friend2,
                self.name_friend1,
                self.name_friend2,
                self.email_friend1,
                self.email_friend2,
            ) = (
                self.id_friend2,
                self.id_friend1,
                self.name_friend2,
                self.name_friend1,
                self.email_friend2,
                self.email_friend1,
            )
        super(Room, self).save(*args, **kwargs)

    def __str__(self):
        return f"Room between {self.name_friend1} and {self.name_friend2}"

class Message(models.Model):
    """
    Represents a single message exchanged in a room.
    """
    room_id = models.IntegerField()  # Reference to the room ID
    sender = models.CharField(max_length=100)  # Name of the sender
    receiver = models.CharField(max_length=100)  # Name of the receiver
    content = models.TextField()  # Message content
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender} to {self.receiver}: {self.content[:50]}"