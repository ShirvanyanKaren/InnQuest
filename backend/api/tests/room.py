from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from api.models import Hotel, Room, Reservation
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from api.serializers.hotel import HotelSerializer
from api.serializers.room import RoomSerializer


class RoomAPIViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.superuser = User.objects.create_superuser(username='admin', password='adminpass')
        
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

        self.data = {  
            "type": "Deluxe",
            "price": 100.0,
            "quantity": 5,
            "beds": 2,
            "sleeps": 4,
            "footage": 400,
            "bed_type": "King",
            "room_images": ["https://example.com/room1.jpg"]
        }
    
    def test_post_room(self):
        self.client.force_authenticate(user=self.superuser)
        hotels = Hotel.objects.all()
        self.data['hotel'] = hotels[0].id
        single_hotel = hotels[0]        
        response = self.client.post(reverse('room-list'), self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        room = Room.objects.get(id=response.data['id'])
        rooms = self.client.get(reverse('room-list'))  
        self.assertEqual(len(rooms.data), 1) 



    def test_get_room_list(self):
        self.client.force_authenticate(user=self.superuser)
        hotels = Hotel.objects.all()
        self.data['hotel'] = hotels[0].id
        post = self.client.post(reverse('room-list'), self.data, format='json')
        response = self.client.get(reverse('room-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        room_data = response.data[0]
        self.assertEqual(room_data['type'], 'Deluxe')
        self.assertEqual(room_data['price'], 100.0)
        self.assertEqual(room_data['quantity'], 5)


        









        
