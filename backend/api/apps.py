from django.apps import AppConfig
import pydoc
import os

class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        """
        This method is called when the Django application is ready.
        We use it to generate the pydoc documentation.
        """
        # Set the DJANGO_SETTINGS_MODULE environment variable if needed
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
        
        # Generate documentation for a specific module or class
        pydoc.writedoc('api.views.hotel.HotelAPIView')
        pydoc.writedoc('api.models')
        pydoc.writedoc('api.views.room.RoomAPIView')
        pydoc.writedoc('api.views.user.UserView')
        pydoc.writedoc('api.management.commands.seed.Command')
        pydoc.writedoc('api.reservation.reservation.ReservationView')
        pydoc.writedoc('api.serializers.reservation')
