from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User

class Hotel(models.Model):
    """  
    Hotel
    07/24/2024
    Karen Shirvanyan & Rober Paronyan
    Hotel model that will be used for DB, backend and front end. This defines what attributes the Hotel class contains

    """
    name = models.CharField(max_length=100, default=None)
    address = models.CharField(max_length=100, default=None)
    state= models.CharField(max_length=100, default=None)
    city = models.CharField(max_length=100, default=None)
    amenities = ArrayField(models.CharField(max_length=100, blank=True, null=True), default=list)
    description = models.TextField(default=None, null=True)
    country = models.CharField(max_length=100, default=None)
    image_urls = ArrayField(models.CharField(max_length=300), default=list)

class Room(models.Model):
    """
    Room
    Simran Shetye
    07/31/2024
    Room model that will be used for DB, backend and front end. This defines what attributes the Room class contains
    """
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
    """
    Room
    Simran Shetye
    07/31/2024
    Reservation model that will be used for DB, backend and front end. This defines what attributes the Reservation class contains
    """
    room = models.ForeignKey(Room, on_delete=models.CASCADE, default=None)
    guest = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, default=None)
    email = models.EmailField(default=None, null=True)
    check_in_date = models.DateField(default=None)
    check_out_date = models.DateField(default=None)
    reservation_price = models.FloatField(default=None)
    num_of_rooms = models.IntegerField(default=None)

