from rest_framework import serializers
from api.models import Hotel

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = "__all__"
        extra_kwargs = {
            "hotel": {"required": True},
            "address": {"required": True},
            "city": {"required": True},
            "state": {"required": True},
        }