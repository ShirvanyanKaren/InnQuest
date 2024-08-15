from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from api.serializers.room import RoomSerializer
from api.models import Room, Reservation
from django.http import JsonResponse, HttpResponse

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

    def get_available_rooms(self, start_date, end_date, hotel_id, num_of_rooms):
        """
        @param start_date: str
        @param end_date: str
        @param hotel_id: int
        @param num_of_rooms: int
        @return: List of available rooms
        @precondition: start_date: str, end_date: str, hotel_id: int, num_of_rooms: int
        Description: This method returns a list of available rooms based on the start date, end date, hotel id, and number of rooms.
        """
        reservations = Reservation.objects.filter(
            hotel=hotel_id,
            check_in_date__lte=end_date,
            check_out_date__gte=start_date
        )
        
        reserved_rooms = {}
        for reservation in reservations:
            reserved_rooms[reservation.room_id] = reserved_rooms.get(reservation.room_id, 0) + reservation.num_of_rooms
        
        rooms = Room.objects.filter(hotel_id=hotel_id)
        available_rooms = []
        for room in rooms:
            reserved_count = reserved_rooms.get(room.id, 0)
            available_count = room.quantity - reserved_count
            room_data = RoomSerializer(room).data
            room_data['available_rooms'] = available_count
            available_rooms.append(room_data)
        available_rooms = [room for room in available_rooms if room['available_rooms'] >= int(num_of_rooms)]
        return available_rooms

    def get_queryset(self):
        """
        @return List of rooms
        Description: This method returns a list of rooms based on the query parameters.
        """
        params = self.request.query_params
        if params.get('check_in') and params.get('check_out') and params.get('hotel_id'):
            return Room.objects.filter(hotel_id=params.get('hotel_id'))
        elif params.get('room_id'):
            return Room.objects.filter(id=params.get('room_id'))
        elif params.get('hotel_id'):
            return Room.objects.filter(hotel_id=params.get('hotel_id'))
        elif not params:
            return Room.objects.all()

    def list(self, request, *args, **kwargs):
        """
        @param request: Request object
        @return: List of rooms
        @exception: If check_in, check_out, hotel_id and num_of_rooms are in query params, return available rooms
        Description: This method returns a list of rooms based on the query parameters.
        """
        queryset = self.get_queryset()
        if 'check_in' in request.query_params and 'check_out' in request.query_params and 'hotel_id' and 'num_of_rooms' in request.query_params:
            available_rooms = self.get_available_rooms(
                request.query_params['check_in'],
                request.query_params['check_out'],
                request.query_params['hotel_id'],
                request.query_params['num_of_rooms']
            )
            return Response(available_rooms)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

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

