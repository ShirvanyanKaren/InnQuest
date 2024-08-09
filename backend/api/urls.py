from django.urls import path
from .views.hotel import HotelAPIView
from .views.room import RoomAPIView
from .views.reservation import ReservationAPIView

urlpatterns = [
    path("hotel/", HotelAPIView.as_view(), name="hotel-list"),
    path("room/", RoomAPIView.as_view(), name="room-list"),
    path("reservation/", ReservationAPIView.as_view(), name="reservation-list"),
    path("reservation/<int:pk>/", ReservationAPIView.as_view(), name="reservation-detail"),
]