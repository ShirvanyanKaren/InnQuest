from django.urls import path
from .views.hotel import HotelAPIView

urlpatterns = [
    path("hotel/", HotelAPIView.as_view(), name="hotel-list"),
]