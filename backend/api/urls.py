from django.urls import path
from .views.hotel import HotelAPIView
from .views.room import RoomAPIView

urlpatterns = [
    path("hotel/", HotelAPIView.as_view(), name="hotel-list"),
    path("room/", RoomAPIView.as_view(), name="room-list")
]