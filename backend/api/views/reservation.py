from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.serializers.reservation import ReservationSerializer
from api.models import Reservation, Room
from django.http import JsonResponse, HttpResponse


class ReservationAPIView(mixins.ListModelMixin,
                         mixins.CreateModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin,
                         generics.GenericAPIView):
    """
<<<<<<< HEAD
    Date: (August 8th, 2024)
    Author: Karen Shirvanyan
    Description: This class is a view for the Reservation model. It allows users to create a new reservation, list all reservations, update a reservation, and delete a reservation.
=======
    ReservationAPIView
    08/08/2024
    Karen Shirvanyan
    Class that hangles the GET PUT And DELETE of the Reservation Class. Utilizes Reservation Model 
>>>>>>> 43057ecf72dbd5d6cd05e36d846729be9f039c51
    """
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_permissions(self):
        """
        @return: List of permissions
        Description: This method returns a list of permissions based on the request method.
        """
        if self.request.method in ['GET','PUT', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        """
        @return: List of reservations
        @precondition: hotel_id: int, check_in_date: str, check_out_date: str
        @exception: If user is authenticated, return list of their reservations else return list of all reservations
        Description: This method returns a list of reservations based on the user's authentication status.
        """
        user = self.request.user
        query_set = Reservation.objects.all()
        hotel_id = self.request.query_params.get('hotel_id')
        check_in_date = self.request.query_params.get('check_in_date')
        check_out_date = self.request.query_params.get('check_out_date')
        if user.is_authenticated:
            reservations = query_set.filter(email=user.email, guest=None)
            for reservation in reservations:
                reservation.guest = user
                reservation.save()
            return query_set.filter(guest=user)
        else:
            query_set = query_set.filter(hotel=hotel_id) if hotel_id else query_set
            query_set = query_set.filter(check_in_date__gte=check_in_date, check_out_date__lte=check_out_date) if check_in_date and check_out_date else query_set
        return query_set
    
    def check_availability(self, request_data):
        """
        @param request_data: dict
        @return: int
        @precondition: hotel: int, room: int, check_in_date: str, check_out_date: str, num_of_rooms: int, email: str
        @exception: If there are not enough rooms available, return an error message
        Description: This method checks if there are enough rooms available based on the hotel, room, check in date, check out date, and number of rooms.
        """
        reservations = Reservation.objects.filter(
            hotel=request_data['hotel'],
            room=request_data['room'],
            check_in_date__lte=request_data['check_out_date'],
            check_out_date__gte=request_data['check_in_date']
        )
        reserved_rooms = 0
        for reservation in reservations:
            reserved_rooms += reservation.num_of_rooms
        room = Room.objects.get(id=request_data['room'])
        return room.quantity - reserved_rooms

    def post(self, request, *args, **kwargs):
        check_availability = self.check_availability(request.data)
        if check_availability < request.data['num_of_rooms']:
            return JsonResponse({'error': 'Not enough rooms available'}, status=409)
        else:
            reservation = Reservation.objects.create(
                hotel_id=request.data['hotel'],
                room_id=request.data['room'],
                check_in_date=request.data['check_in_date'],
                reservation_price=request.data['reservation_price'],
                check_out_date=request.data['check_out_date'],
                num_of_rooms=request.data['num_of_rooms'],
                email=request.data['email'] if not self.request.user.is_authenticated else self.request.user.email
            )
            return JsonResponse({'message': 'Reservation created successfully', 'reservation': ReservationSerializer(reservation).data}, status=201)

    def get(self, request, *args, **kwargs):
        """
        @param request: Request object
        @return: List of reservations
        """
        return self.list(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        @param request: Request object
        @precondition: id: int
        @exception: If user is authenticated, update reservation
        @return: HttpResponse object
        """
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        @param request: Request object
        @precondition: id: int
        @return: HttpResponse object
        @exception: If user is authenticated, delete reservation
        """
        return self.destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        """
        @param serializer: ReservationSerializer object
        @return: None
        @exception: If user is authenticated, save reservation to user
        Description: This method saves the reservation to the user if they are authenticated.
        """
        user = self.request.user
        serializer.save(guest=user)

    def perform_update(self, serializer):
        """
        @param serializer: ReservationSerializer object
        @return: None
        @exception: If user is authenticated, save updated reservation to user
        Description: This method saves the updated reservation to the user if they are authenticated.
        """
        user = self.request.user
        serializer.save(guest=user)