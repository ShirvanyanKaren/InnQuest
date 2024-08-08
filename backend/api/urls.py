from django.urls import path
from .views.hotel import HotelAPIView
from .views.room import RoomListCreate

urlpatterns = [
    path("hotel/", HotelAPIView.as_view(), name="hotel-list"),
    path("room/", RoomListCreate.as_view(), name="room-list")
]