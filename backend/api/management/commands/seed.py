from django.core.management.base import BaseCommand
from api.models import Hotel, Reservation, Room
from faker import Faker
import random
import json
import pathlib

# Jira Issue: YI-26

class Command(BaseCommand):
    help = 'Seeds the database with hotel data'
    seed_data = json.loads(open(pathlib.Path(__file__).parent / 'hotelseed.json').read())
    faker = Faker()
    company = "InnQuest Hotels"

    def handle(self, *args, **kwargs):
        Hotel.objects.all().delete()
        self._seed_hotels()
        self.stdout.write('Seeding data...')

    def _seed_hotels(self):
        cities = self.seed_data['hotel_cities']
        for city in cities:
            num_hotels = cities[city]['hotels']
            hotel_geo = [' ', ' East ', ' West ']
            images = cities[city]['images']
            base_zip = cities[city]['zip']
            for i in range(num_hotels):
                image = random.choice(images)
                images.remove(image)
                name = self.company + hotel_geo[i] + city
                zip = base_zip + random.randint(1, 100)
                hotel = Hotel.objects.create(
                    name=name,
                    address=' '.join(self.faker.address().split('\n')[0].split(' ')[0:3]) + ', ' + str(zip),
                    state=cities[city]['state'],
                    city=city,
                    image_url=image,
                    country='United States'
                )
                print(f'Created hotel: {hotel.name} in {hotel.city}, {hotel.state}')
            