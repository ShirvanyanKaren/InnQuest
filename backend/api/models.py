from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Hotel(models.Model):
    name = models.CharField(max_length=100, default=None)
    address = models.CharField(max_length=100, default=None)
    state= models.CharField(max_length=100, default=None)
    city = models.CharField(max_length=100, default=None)
    country = models.CharField(max_length=100, default=None)
    image_url = models.CharField(max_length=300, default=None)

class Rooms(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    type = models.CharField(max_length=100)
    price = models.FloatField()
    quantity = models.IntegerField(default=0)
    beds = models.IntegerField()
    sleeps = models.IntegerField(blank=True, null=True)
    footage = models.IntegerField(blank=True, null=True)
    bed_type = models.CharField(max_length=100, blank=True, null=True)
    room_images = ArrayField(models.CharField(max_length=300))
