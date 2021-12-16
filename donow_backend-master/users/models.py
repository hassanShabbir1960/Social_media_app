from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


# Create your models here.



class details (models.Model):
    first_name = models.CharField(max_length = 30, null = False)
    last_name = models.CharField(max_length = 30, null = False)
    bio = models.TextField(max_length = 500, null = True)
    age = models.IntegerField(null = True)
    location = models.CharField(max_length = 30, null = True)
    balance = models.FloatField(null = True)
    profile_image=models.ImageField(upload_to=settings.MEDIA_ROOT+'profile_images', null = True)

    facebook_profile = models.URLField(max_length = 200, null = True)
    instagram_profile = models.URLField(max_length = 200, null = True)
    pinterest_profile = models.URLField(max_length = 200, null = True)
    youtube_profile = models.URLField(max_length = 200, null = True)
    twitter_profile = models.URLField(max_length = 200, null = True)

    user = models.ForeignKey(User, on_delete = models.CASCADE, null = False)

class Following( models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=False,related_name='user')
    follower=models.ForeignKey(User,on_delete=models.CASCADE,null=False,related_name='follower')
    