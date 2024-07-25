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
     permission_classes = [AllowAny]

     def post(self, request, *args, **kwargs):
          return self.create(request, *args, **kwargs)
    
     def get(self, request, *args, **kwargs):
          return self.list(request, *args, **kwargs)
    
     def delete(self, request, *args, **kwargs):
          return self.destroy(request, *args, **kwargs)