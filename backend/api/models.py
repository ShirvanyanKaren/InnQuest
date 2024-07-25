from django.db import models

# Create your models here.
class Hotel(models.Model):
    name = models.CharField(max_length=100, default=None)
    address = models.CharField(max_length=100, default=None)
    state= models.CharField(max_length=100, default=None)
    city = models.CharField(max_length=100, default=None)
    country = models.CharField(max_length=100, default=None)
    image_url = models.CharField(max_length=300, default=None)