from rest_framework import serializers
from api.models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"
        extra_kwargs = {
            "guest": {"read_only": True, "required": False},
            "email": {"required": False},
        }