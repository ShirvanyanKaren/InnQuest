from rest_framework import serializers
from api.models import Room

class RoomSerializer(serializers.ModelSerializer):
    """
    Date: (August 5th, 2024)
    Author: Porfirio Tavira
    Description: This class is a serializer for the Room model. It allows user to serialize and deserialize Room objects.
    """
    class Meta:
        model = Room
        fields = "__all__"
        extra_kwargs = {
            "hotel": {"read_only": True}
        }