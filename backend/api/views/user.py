from django.shortcuts import render
from django.contrib.auth.models import User
from api.models import Reservation
from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from api.serializers.user import UserSerializer
from django.http import JsonResponse, HttpResponse

class UserView(mixins.ListModelMixin,
                mixins.CreateModelMixin,
                generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return self.list(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    def post(self, request, *args, **kwargs):
        try: 
            user = User.objects.create_user(
                username=request.data['username'],
                email=request.data['email'],
                password=request.data['password'],
                first_name=request.data['first_name'],
                last_name=request.data['last_name']
            )
            user.save()
            return HttpResponse(status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=409)