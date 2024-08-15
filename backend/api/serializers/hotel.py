from rest_framework import serializers
from api.models import Hotel

class HotelSerializer(serializers.ModelSerializer):
    """
    Date: (July 25th, 2024)
    Author: Porfirio Tavira
    Description: This serializer handles the conversion of Hotel model instances to and from JSON format. 
    It is responsible for validating and serializing the data related to Hotel instances, ensuring data integrity.
    """

    class Meta:
        """
        Description: Meta class that specifies the model and fields to be included in the serialization process.
        @model: The model associated with this serializer is the Hotel model.
        @fields: All fields in the Hotel model will be serialized.
        @extra_kwargs: Additional field-specific configurations. The 'hotel', 'address', 'city', and 'state' fields 
        are marked as required, ensuring that they must be provided during serialization.
        """
        
        model = Hotel
        fields = "__all__"
        extra_kwargs = {
            "hotel": {"required": True},
            "address": {"required": True},
            "city": {"required": True},
            "state": {"required": True},
        }