from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class MyUser(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True)
    match_history = models.BooleanField(default=True)
    display_friends = models.BooleanField(default=True)
    forty_two = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='myuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='myuser_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    def __str__(self):
        return self.email