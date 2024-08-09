from django.core.management.base import BaseCommand
from api.models import Hotel, Room, Reservation
from django.contrib.auth.models import User
from faker import Faker
import random
import json
import pathlib
from datetime import timedelta


class Command(BaseCommand):
    seed_data = json.loads(open(pathlib.Path(__file__).parent / 'hotelseed.json').read())
    faker = Faker()
    company = "InnQuest Hotels"
    amenities = ["Parking", "Air Conditioning", "Gym", "Pool", "Free Wi-Fi", "Connecting Rooms", "Bar", "Spa", "24/7 Front Desk", "Electric Vehicle Charging", "Restaurant", "Room Service", "Laundry Service", "Pet Friendly", "Non-smoking", "Breakfast Included", "Hot Tub"]

    def handle(self, *args, **kwargs):
        User.objects.all().delete()
        Hotel.objects.all().delete()
        Room.objects.all().delete()
        Reservation.objects.all().delete()
        self.stdout.write('Seeding data...')
        self._seed_users()
        self._seed_hotels()
        self._seed_rooms()
        self._seed_reservations()
        self.stdout.write('Data seeded successfully')
    

    def _seed_users(self):
        for _ in range(60):
            username = self.faker.email()
            email = username
            user = User.objects.create_user(
                username=username,
                email=email,
                password='password',
                first_name=self.faker.first_name(),
                last_name=self.faker.last_name()
            )
            self.stdout.write(f'Created user: {user.username}')

    def _seed_hotels(self):
        cities = self.seed_data['hotel_cities']
        descriptions = self.seed_data['hotel_descriptions']
        for city in cities:
            num_hotels = cities[city]['hotels']
            hotel_geo = [' ', ' East ', ' West ']
            images = cities[city]['images']
            base_zip = cities[city]['zip']
            for i in range(num_hotels):
                interior_images = self.seed_data['hotel_interior'].copy()
                image = random.choice(images)
                images.remove(image)
                image_urls = []
                image_urls.append(image)
                for _ in range(8):
                    random_image = random.choice(interior_images)
                    image_urls.append(random_image)
                    interior_images.remove(random_image)
                name = self.company + hotel_geo[i] + city
                zip = base_zip + random.randint(1, 100)
                mandatory_amenities = self.amenities[:3]
                amenities = random.sample(self.amenities, random.randint(1, len(self.amenities)))
                amenities = list(set(amenities + mandatory_amenities))
                amenities_copy = amenities
                description = random.choice(descriptions)
                description = description.replace('%', city)
                while '$' in description:
                    description = description.replace('$', amenities_copy.pop(random.randint(0, len(amenities_copy) - 1)).lower(), 1)
                hotel = Hotel.objects.create(
                    name=name,
                    address=' '.join(self.faker.address().split('\n')[0].split(' ')[0:3]) + ', ' + str(zip),
                    state=cities[city]['state'],
                    city=city,
                    description=description,
                    amenities=amenities,
                    image_urls=image_urls,
                    country='United States'
                )
                print(f'Created hotel: {hotel.name} in {hotel.city}, {hotel.state}')


    def _seed_rooms(self):
        hotels = Hotel.objects.all()
        rooms = self.seed_data['rooms']
        for hotel in hotels:
            print(f'Creating rooms for {hotel.name} in {hotel.city}, {hotel.state}')
            for room, dets in rooms.items():
                room = Room.objects.create(
                    hotel=hotel,
                    type=room,
                    price=dets['price'],
                    beds=dets['beds'],
                    bed_type=dets['bed_type'],
                    room_images=dets['images'],
                    sleeps=dets['sleeps'],
                    footage=dets['footage'],
                    quantity=random.randint(12, 20)
                )
                print(f'Created room: {room.type} in hotel {hotel.name}')
                

    def _seed_reservations(self):
        users = User.objects.all()
        rooms = Room.objects.all()
        for _ in range(700):
            check_in_date = self.faker.date_between(start_date='today', end_date='+30d')
            check_out_date = check_in_date + timedelta(days=random.randint(1, 10))
            num_of_rooms = random.randint(1, 3)
            room = random.choice(rooms)
            price = (check_out_date - check_in_date).days * room.price * num_of_rooms
            reservation = Reservation.objects.create(
                room=room,
                hotel=room.hotel,
                guest=random.choice(users),
                check_in_date=check_in_date,
                check_out_date=check_out_date,
                reservation_price=price,
                num_of_rooms=num_of_rooms,
                email=None
            )
            self.stdout.write(f'Created reservation for user: {reservation.guest.username} for room {reservation.room.type} with price {reservation.reservation_price} check in {reservation.check_in_date} check out {reservation.check_out_date}')
