from django.urls import path
from .views.hotel import HotelAPIView
from .views.room import RoomAPIView
from .views.reservation import ReservationAPIView
from .views.checkout import StripeCheckout
from .views.user import UserView

urlpatterns = [
    path("hotel/", HotelAPIView.as_view(), name="hotel-list"),
    path("room/", RoomAPIView.as_view(), name="room-list"),
    path("reservation/", ReservationAPIView.as_view(), name="reservation-list"),
    path("reservation/<int:pk>/", ReservationAPIView.as_view(), name="reservation-detail"),
    path("checkout/", StripeCheckout.as_view(), name="stripe-checkout"),
    path("user/", UserView.as_view(), name="user-list")
]