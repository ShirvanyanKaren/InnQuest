from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.serializers.hotel import HotelSerializer
from api.models import Hotel

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
     
     def get_queryset(self):
          params = self.request.query_params
          if params.get('hotel_id'):
                return self.get_by_id(params.get('hotel_id'))
          elif params.get('query'):
                return Hotel.objects.filter(city__icontains=params.get('query')) | Hotel.objects.filter(state__icontains=params.get('query')) | Hotel.objects.filter(address__icontains=params.get('query'))
          elif not params:
                return Hotel.objects.all()
     def post(self, request, *args, **kwargs):
          return self.create(request, *args, **kwargs)
    
     def get(self, request, *args, **kwargs):
          return self.list(request, *args, **kwargs)
    
     def delete(self, request, *args, **kwargs):
          return self.destroy(request, *args, **kwargs)