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
        if self.request.method == 'POST':
            return [AllowAny()]
        if self.request.method == 'DELETE':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def post(self, request, *args, **kwargs):
        room = Room.objects.get(id=request.data['room'])
        if room.quantity < request.data['num_of_rooms']:
            return JsonResponse({'error': 'Not enough rooms available'}, status=400)
        return self.create(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        reservation = Reservation.objects.get(id=request.data['id'])
        room = Room.objects.get(id=request.data['room'])
        if room.quantity < request.data['num_of_rooms']:
            return JsonResponse({'error': 'Not enough rooms available'}, status=400)
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
    