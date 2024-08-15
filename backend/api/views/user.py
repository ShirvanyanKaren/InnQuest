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
    """
    Date: (August 8th, 2024)
    Author: Porfirio Tavira
    Description: This class is a view for the User model. It allows users to create a new account and also enables get request to list all users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        """
        @param request: Request object
        @return: List of users as class object UserSerializer
        @exception: If user is not authenticated, return list of users
        Description: This method returns a list of users if the user is authenticated, otherwise it returns an empty list.
        """
        if request.user.is_authenticated:
            return self.list(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    def post(self, request, *args, **kwargs):
        """
        @param request: Request object
        @return: HttpResponse object
        @exception: If user is not authenticated, create a new user
        @precondition: username: str, email: str, password: str, first_name: str, last_name: str
        Description: This method creates a new user if the data is valid, otherwise it returns an error message.
        """
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