from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.serializers.hotel import HotelSerializer
from api.serializers.room import RoomSerializer
from rest_framework.response import Response
from api.models import Hotel, Reservation, Room


class HotelAPIView(mixins.ListModelMixin,
                     mixins.CreateModelMixin,
                     mixins.DestroyModelMixin,
                     generics.GenericAPIView):
     queryset = Hotel.objects.all()
     serializer_class = HotelSerializer

    
     def get_permissions(self):
          if self.request.method == 'POST':
                return [AllowAny()]
          if self.request.method == 'DELETE':
                return [IsAuthenticated()]
          return [AllowAny()]
    
     def get_by_id(self, id):
          return Hotel.objects.filter(id=id)
     
     def get_available_rooms(self, queryset, start_date, end_date, num_of_rooms, min_price, max_price):
          hotels = []
          for hotel in queryset:
                reservations = Reservation.objects.filter(
                    hotel=hotel.id,
                    check_in_date__lte=end_date,
                    check_out_date__gte=start_date
                )
                reserved_rooms = {}
                for reservation in reservations:
                    reserved_rooms[reservation.room_id] = reserved_rooms.get(reservation.room_id, 0) + reservation.num_of_rooms
                rooms = Room.objects.filter(hotel=hotel, price__gte=min_price, price__lte=max_price)
                available_rooms = []
                for room in rooms:
                    reserved_count = reserved_rooms.get(room.id, 0)
                    available_count = room.quantity - reserved_count
                    room_data = RoomSerializer(room).data
                    room_data['available_rooms'] = available_count
                    available_rooms.append(room_data)
                available_rooms = [room for room in available_rooms if room['available_rooms'] >= int(num_of_rooms)]
                hotel_serializer = HotelSerializer(hotel).data
                hotel_serializer['rooms'] = available_rooms
                hotels.append(hotel_serializer)
          return hotels
               
     def list(self, request, *args, **kwargs):
          queryset = self.get_queryset()
          if 'check_in' in request.query_params and 'check_out' in request.query_params and 'rooms' in request.query_params:
                available_rooms = self.get_available_rooms(
                    queryset,
                    request.query_params['check_in'],
                    request.query_params['check_out'],
                    request.query_params['rooms'],
                    request.query_params['min_price'] if request.query_params.get('min_price') else 0,
                    request.query_params['max_price'] if request.query_params.get('max_price') else 1000
                )
                return Response(available_rooms)
          serializer = self.get_serializer(queryset, many=True)
          return Response(serializer.data)

     
     def get_queryset(self):
          params = self.request.query_params
          if params.get('hotel_id'):
                return self.get_by_id(params.get('hotel_id'))
          elif params.get('query'):
                query_set = Hotel.objects.filter(city__icontains=params.get('query')) | Hotel.objects.filter(state__icontains=params.get('query'))
                if params.get('amenities'):
                    amenities = params.get('amenities').split(',')
                    query_set = query_set.filter(amenities__contains=amenities)
                return query_set
          elif not params:
                return Hotel.objects.all()
    
     def post(self, request, *args, **kwargs):
          return self.create(request, *args, **kwargs)
    
     def get(self, request, *args, **kwargs):
          return self.list(request, *args, **kwargs)
    
     def delete(self, request, *args, **kwargs):
          return self.destroy(request, *args, **kwargs)