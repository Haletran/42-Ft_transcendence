from django.db import models

class Friend(models.Model):
    id_friend1 = models.IntegerField()  # Store user ID directly
    name_friend1 = models.CharField(max_length=100)
    email_friend1 = models.EmailField()
    id_friend2 = models.IntegerField()  # Store user ID directly
    name_friend2 = models.CharField(max_length=100)
    email_friend2 = models.EmailField()
    sender = models.CharField(max_length=100)
    receiver = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_friend1', 'id_friend2'], name='unique_friendship')
        ]

    def __str__(self):
        return f"Friendship between {self.name_friend1} and {self.name_friend2}"
    
    def add_friend(self, friend_id, friend_name, friend_email):
        """Add a friend (creates bi-directional friendship)"""
        Friend.objects.create(
            id_friend1=self.id_friend1,
            name_friend1=self.name_friend1,
            email_friend1=self.email_friend1,
            id_friend2=friend_id,
            name_friend2=friend_name,
            email_friend2=friend_email,
            status='accepted'
        )
        Friend.objects.create(
            id_friend1=friend_id,
            name_friend1=friend_name,
            email_friend1=friend_email,
            id_friend2=self.id_friend1,
            name_friend2=self.name_friend1,
            email_friend2=self.email_friend1,
            status='accepted'
        )
        
    def remove_friend(self, friend_id):
        """Remove a friend (removes bi-directional friendship)"""
        Friend.objects.filter(id_friend1=self.id_friend1, id_friend2=friend_id).delete()
        Friend.objects.filter(id_friend1=friend_id, id_friend2=self.id_friend1).delete()
    
    def get_friends(self):
        """Return QuerySet of all friends"""
        return Friend.objects.filter(id_friend1=self.id_friend1, status='accepted')
    
    def change_status(self, user_id, new_status):
        """Change the status of the friendship"""
        if user_id == self.id_friend2:
            self.status = new_status
            self.save()
        else:
            raise ValueError("User ID does not match the receiver ID")