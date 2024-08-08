from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.serializers import RoomSerializer
from api.models import Reservation, Room, Hotel
from django.http import JsonResponse, HttpResponse
from dotenv import load_dotenv
import os

load_dotenv()
class RoomListCreate(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        hotel = self.request.query_params.get('hotel_id')
        return Room.objects.filter(hotel=hotel)

    def perform_create(self, serializer):
        hotel = self.request.user.hotel
        serializer.save(hotel=hotel)

