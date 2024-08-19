from rest_framework import serializers
from api.models import Room, Hotel

class RoomSerializer(serializers.ModelSerializer):
    """
    Date: (August 5th, 2024)
    Author: Porfirio Tavira
    Description: This serializer is responsible for converting Room model instances to and from JSON format. 
    It ensures that the data associated with Room instances is validated and properly serialized.
    """
    hotel = serializers.PrimaryKeyRelatedField(queryset=Hotel.objects.all())
    class Meta:
        """
        Description: Meta class that defines the model and fields to be included in the serialization process.
        @model: The model associated with this serializer is the Room model.
        @fields: All fields in the Room model will be serialized.
        @extra_kwargs: Additional configurations for specific fields. The 'hotel' field is set to be read-only, 
        meaning it cannot be modified through the serializer.
        """
        
        model = Room
        fields = "__all__"
        extra_kwargs = {
            "hotel": {"read_only": True}
        }