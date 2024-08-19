from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from api.models import Hotel, Room, Reservation
from django.contrib.auth.models import User
from datetime import datetime, timedelta



class ReservationAPIViewTestCase(APITestCase):
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
            check_in_date=datetime.now().date(),
            check_out_date=(datetime.now().date() + timedelta(days=2)),
            reservation_price=100.0,
            num_of_rooms=1
        )
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.superuser)

    def test_get_reservation_list(self):
        response = self.client.get(reverse('reservation-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        reservation_data = response.data[0]
        self.assertEqual(reservation_data['room'], self.room.id)
        self.assertEqual(reservation_data['guest'], self.user.id)
        self.assertEqual(reservation_data['hotel'], self.hotel.id)
        self.assertEqual(reservation_data['email'], self.user.email)
        self.assertEqual(reservation_data['check_in_date'], datetime.now().date().strftime('%Y-%m-%d'))
        self.assertEqual(reservation_data['check_out_date'], (datetime.now().date() + timedelta(days=2)).strftime('%Y-%m-%d'))
        self.assertEqual(reservation_data['reservation_price'], 100.0)
        self.assertEqual(reservation_data['num_of_rooms'], 1)


