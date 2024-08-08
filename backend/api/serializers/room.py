from rest_framework import serializers
from api.models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"
        extra_kwargs = {
            "hotel": {"read_only": True}
        }