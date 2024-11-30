from django.db import models

class Friend(models.Model):
    user_id = models.IntegerField()  # Store user ID directly
    name = models.CharField(max_length=100)
    email = models.EmailField()
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user_id', 'email'], name='unique_email_per_user')
        ]

    def __str__(self):
        return f"{self.name}'s friend profile"
    
    def add_friend(self, friend):
        """Add a friend (creates bi-directional friendship)"""
        self.friends.add(friend)
        
    def remove_friend(self, friend):
        """Remove a friend (removes bi-directional friendship)"""
        self.friends.remove(friend)
    
    def get_friends(self):
        """Return QuerySet of all friends"""
        return self.friends.all()
    
class FriendRequest(models.Model):
    sender = models.IntegerField()
    receiver = models.IntegerField()
    sender_mail = models.EmailField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sender', 'receiver'], name='unique_friend_request')
        ]

    def __str__(self):
        return f"Friend request from {self.sender.name} to {self.receiver.name}"