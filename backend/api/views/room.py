from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from api.serializers.room import RoomSerializer
from api.models import Room, Reservation
from django.http import JsonResponse, HttpResponse
import datetime as dt

class RoomAPIView(generics.GenericAPIView, mixins.ListModelMixin,
                  mixins.CreateModelMixin, mixins.DestroyModelMixin):
    """
    Date: (August 7th, 2024)
    Author: Karen Shirvanyan
    Description: This class is a view for the Room model. It allows users to create a new room, list all rooms, and delete a room.
    """

    queryset = Room.objects.all()
    serializer_class = RoomSerializer
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

    def get_available_rooms(self, params, rooms):
        """
        @param params: Query parameters
        @return: List of rooms
        Description: This method returns a list of available rooms based on the query parameters.
        """
        check_in = params.get('check_in')
        check_out = params.get('check_out')
        hotel_id = params.get('hotel_id')
        number_of_rooms = params.get('rooms')
        reservations = Reservation.objects.filter(
            hotel_id=hotel_id,
            check_in_date__lte=check_out or dt.date.today(),
            check_out_date__gte=check_in or dt.date.today() + dt.timedelta(days=1),     
            )
        reserved_rooms = {}
        for reservation in reservations:
            reserved_rooms[reservation.room_id] = reserved_rooms.get(reservation.room_id, 0) + reservation.num_of_rooms
        available_rooms = []
        for room in rooms:
            reserved_count = reserved_rooms.get(room.id, 0)
            available_count = room.quantity - reserved_count
            room_data = RoomSerializer(room).data
            room_data['available_rooms'] = available_count
            available_rooms.append(room_data)
        return available_rooms

    def list(self, request, *args, **kwargs):
        """
        @param request: Request object
        @return: List of rooms
        @exception: If user is authenticated, return list of rooms
        Description: This method returns a list of rooms based on the user's authentication status.
        """
        query_set = self.get_queryset()
        params = request.query_params
        if 'hotel_id' in params:
            available_rooms = self.get_available_rooms(params, query_set)
            return Response(available_rooms)
        serializer = self.get_serializer(query_set, many=True)
        return Response(serializer.data)
        


    def get_queryset(self):
        """
        @return List of rooms
        Description: This method returns a list of rooms based on the query parameters.
        """
        params = self.request.query_params
        if params.get('hotel_id'):
             return Room.objects.filter(hotel_id=params.get('hotel_id'))
        elif params.get('room_id'):
            return Room.objects.filter(id=params.get('room_id'))
        elif not params and self.request.user.is_authenticated:
            return Room.objects.all()
        return Room.objects.none()
    
    def get(self, request, *args, **kwargs):
        """
        @param request: Request object
        @return: List of rooms
        @exception: If user is authenticated, return list of rooms
        Description: This method returns a list of rooms based on the user's authentication status.
        """
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        """
        @param request: Request object
        @return: HttpResponse object
        @precondition: hotel_id: int, room_type: str, price: float, quantity: int
        Description: This method creates a new room if the user is authenticated, otherwise it returns an error message.
        """
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        @param request: Request object
        @return: HttpResponse object
        @exception: If user is authenticated, delete a room
        Description: This method deletes a room if the user is authenticated, otherwise it returns an error message.
        """
        return self.destroy(request, *args, **kwargs)

