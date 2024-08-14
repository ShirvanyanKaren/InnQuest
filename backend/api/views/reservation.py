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
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_permissions(self):
        if self.request.method in ['GET','PUT', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
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
        return self.list(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(guest=user)

    def perform_update(self, serializer):
        user = self.request.user
        serializer.save(guest=user)