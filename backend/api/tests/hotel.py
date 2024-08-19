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
        
        self.reservation = Reservation.objects.create(
            room=self.room,
            guest=self.user,
            hotel=self.hotel,
            email=self.user.email,
            check_in_date=(datetime.now().date() + timedelta(days=2)).strftime('%Y-%m-%d'),
            check_out_date=(datetime.now().date() + timedelta(days=4)).strftime('%Y-%m-%d'),
            reservation_price=100.0,
            num_of_rooms=1
        )
        
        self.client = APIClient()
    def test_get_hotel_list(self):
        response = self.client.get(reverse('hotel-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        hotel_data = response.data[0]
        self.assertEqual(hotel_data['name'], 'Hotel California')
        self.assertEqual(hotel_data['address'], '42 Sunset Blvd')
        self.assertEqual(hotel_data['city'], 'Los Angeles')
        self.assertEqual(hotel_data['state'], 'CA')
        self.assertEqual(hotel_data['amenities'], ['WiFi', 'Pool'])
        self.assertEqual(hotel_data['description'], 'A nice place to stay.')
        self.assertEqual(hotel_data['country'], 'USA')
        self.assertEqual(hotel_data['image_urls'], ['https://example.com/hotel1.jpg'])
        


    def test_get_available_rooms(self):
        query_params = {
            'check_in': (datetime.now().date() + timedelta(days=2)).strftime('%Y-%m-%d'),
            'check_out': (datetime.now().date() + timedelta(days=4)).strftime('%Y-%m-%d'),
            'rooms': '1',
        }
        
        response = self.client.get(reverse('hotel-list'), query_params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        hotel_data = response.data[0]
        self.assertTrue(len(hotel_data['rooms']) > 0)
        room_data = hotel_data['rooms'][0]
        self.assertEqual(room_data['type'], 'Deluxe')
        self.assertEqual(room_data['available_rooms'], 4)
        print(room_data)
        reservations = Reservation.objects.filter(room=self.room)

    def test_no_available_rooms(self):
        extra_reservation = Reservation.objects.create(
            room=self.room,
            guest=self.user,
            hotel=self.hotel,
            email=self.user.email,
            check_in_date=(datetime.now().date() + timedelta(days=2)).strftime('%Y-%m-%d'),
            check_out_date=(datetime.now().date() + timedelta(days=4)).strftime('%Y-%m-%d'),
            reservation_price=100.0,
            num_of_rooms=4
        )
        query_params = {
            'check_in': (datetime.now().date() + timedelta(days=2)).strftime('%Y-%m-%d'),
            'check_out': (datetime.now().date() + timedelta(days=4)).strftime('%Y-%m-%d'),
            'rooms': '1',
        }
        response = self.client.get(reverse('hotel-list'), query_params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        hotel_data = response.data[0]
        self.assertEqual(len(hotel_data['rooms']), 0)









        
    







