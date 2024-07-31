from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User

# Create your models here.
class Hotel(models.Model):
    name = models.CharField(max_length=100, default=None)
    address = models.CharField(max_length=100, default=None)
    state= models.CharField(max_length=100, default=None)
    city = models.CharField(max_length=100, default=None)
    country = models.CharField(max_length=100, default=None)
    image_url = models.CharField(max_length=300, default=None)

class Room(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    type = models.CharField(max_length=100)
    price = models.FloatField()
    quantity = models.IntegerField(default=0)
    beds = models.IntegerField()
    sleeps = models.IntegerField(blank=True, null=True)
    footage = models.IntegerField(blank=True, null=True)
    bed_type = models.CharField(max_length=100, blank=True, null=True)
    room_images = ArrayField(models.CharField(max_length=300))

class Reservation(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, default=None)
    guest = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True, blank=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, default=None)
    email = models.EmailField(default=None, null=True)
    check_in_date = models.DateField(default=None)
    check_out_date = models.DateField(default=None)
    reservation_price = models.FloatField(default=None)
    num_of_rooms = models.IntegerField(default=None)
