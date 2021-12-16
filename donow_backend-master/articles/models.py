from django.db import models
from django.contrib.sites.models import Site
# Create your models here.

class Article(models.Model):
    title = models.CharField(max_length=120)
    content = models.TextField()
    # site = Site(domain="donow.com", name="DoNow")
    # site.save()
#

    def __str__(self):
        return self.title