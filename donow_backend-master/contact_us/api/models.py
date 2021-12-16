from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from datetime import datetime

class contactUS(models.Model):
    email = models.CharField(max_length=50)
    subject = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    issue = models.CharField(max_length=50)
    attachment = models.FileField(upload_to=settings.MEDIA_ROOT + 'contact_us_attachments', blank=True)

class contactUsAttachments(models.Model):
    contact_form = models.ForeignKey(contactUS, on_delete=models.CASCADE)
    attachment =  models.FileField(upload_to=settings.MEDIA_ROOT + 'contact_us_attachments', blank=False, null=False)

class CareerGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Jobs(models.Model):
    career_group = models.ForeignKey(CareerGroup, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.title