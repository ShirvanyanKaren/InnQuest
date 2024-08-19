from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from api.models import Hotel, Room, Reservation
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from api.serializers.hotel import HotelSerializer
from api.serializers.room import RoomSerializer
class HotelAPIViewTestCase(APITestCase):
    def setUp(self):
        # Create a test user and superuser
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.superuser = User.objects.create_superuser(username='admin', password='adminpass')
        
        # Create hotel and room data
        self.hotel = Hotel.objects.create(
            name="Hotel California",
            address="42 Sunset Blvd",
            city="Los Angeles",
            state="CA",
            amenities=["WiFi", "Pool"],
            description="A nice place to stay.",
            country="USA",
            image_urls=["https://example.com/hotel1.jpg"]
        )
        
        self.room = Room.objects.create(
            hotel=self.hotel,
            type="Deluxe",
            price=100.0,
            quantity=5,
            beds=2,
            sleeps=4,
            footage=400,
            bed_type="King",
            room_images=["https://example.com/room1.jpg"]
        )
        
        # Create a reservation
        self.reservation = Reservation.objects.create(
            hotel=self.hotel,
            room=self.room,
            guest=self.user,
            email="testuser@example.com",
            check_in_date=datetime.now().date(),
            check_out_date=(datetime.now() + timedelta(days=3)).date(),
            reservation_price=300.0,
            num_of_rooms=2
        )
        
        self.client = APIClient()

    def test_list_hotels(self):
        response = self.client.get(reverse('hotel-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Hotel California")


    def test_check_available_rooms(self):
        url = reverse('hotel-list')
        params = {
            'check_in': (datetime.now().date()).isoformat(),
            'check_out': (datetime.now().date() + timedelta(days=2)).isoformat(),
            'rooms': 1,
            'min_price': 50,
            'max_price': 150
        }
        hotels = HotelSerializer(Hotel.objects.all()).data
        response = self.client.get(url, hotels , params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
        self.assertEqual(response.data[0]['rooms'][0]['type'], "Deluxe")


