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
     """
     HotelAPIView
     07/25/2024
     Porfirio Tavira
     Hotel controller that does the GET POST and DELETE for the Hotel Class
     This class uses the Hotel model and serializer to be utilized by the frontend
     """
     queryset = Hotel.objects.all()
     serializer_class = HotelSerializer
     """
     Date: (July 25th, 2024)
     Author: Porfirio Tavira
     Description: This class is a view for the Hotel model. It allows user to get hotel by id, list hotels given a query, check availability of rooms. It also allows admin to create a new hotel and delete a hotel.
     """

     def get_permissions(self):
          """
          @return: List of permissions
          Description: This method returns a list of permissions based on the request method.
          """
          if self.request.method == 'POST':
                return [AllowAny()]
          if self.request.method == 'DELETE':
                return [IsAuthenticated()]
          return [AllowAny()]
    
     def get_by_id(self, id):
          """
          @param id: int
          @return: Hotel object
          Description: This method returns a hotel object based on the id.
          """
          return Hotel.objects.filter(id=id)
     
     def get_available_rooms(self, queryset, start_date, end_date, num_of_rooms, min_price, max_price):
          """
          @param queryset: Hotel object
          @param start_date: str
          @param end_date: str
          @param num_of_rooms: str
          @param min_price: str
          @param max_price: str
          @precondition: start_date: str, end_date: str, num_of_rooms: int, min_price: float, max_price: float
          @return: List of hotels with available rooms
          Description: This method returns a list of hotels with available rooms based on the start date, end date, number of rooms, min price and max price.
          """
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
          """
          @param request: Request object
          @return: List of hotels
          @exception: If check_in, check_out and rooms are in query params, return available rooms
          Description: This method returns a list of hotels based on the query params. If check_in, check_out and rooms are in query params, it returns a list of available
          rooms based on the query params.
          """
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
          """
          @return: List of hotels
          Description: This method returns a list of hotels based on the query params.
          """
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
          """
          @param request: Request object
          @return: Response object
          @exception: If user is not authenticated, create a new hotel
          @precondition: name: str, address: str, state: str, city: str, amenities: list, description: str, country: str, image_urls: list
          Description: This method creates a new hotel if the data is valid, otherwise it returns an error message.
          """
          return self.create(request, *args, **kwargs)
    
     def get(self, request, *args, **kwargs):
          """
          @param request: Request object
          @return: List of hotels
          @exception: If user is not authenticated, return list of hotels
          Description: This method returns a list of hotels if the user is authenticated, otherwise it returns an empty list.
          """
          return self.list(request, *args, **kwargs)
    
     def delete(self, request, *args, **kwargs):
          """
          @param request: Request object
          @return: Response object
          @exception: If user is not authenticated, delete a hotel
          Description: This method deletes a hotel if the user is authenticated, otherwise it returns an error message.
          """
          return self.destroy(request, *args, **kwargs)
     

     