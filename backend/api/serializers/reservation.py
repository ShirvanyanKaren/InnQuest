from rest_framework import serializers
from api.models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    """
    Date: (August 8th, 2024)
    Author: Porfirio Tavira
    Description: This serializer is used to convert Reservation model instances into JSON format and vice versa.
    It handles validation and transformation of Reservation data, ensuring that only valid data is saved to the database.
    """
    
    class Meta:
        """
        Description: Meta class defining the model and fields to be used in the serializer.
        @model: The model associated with this serializer is the Reservation model.
        @fields: All fields in the Reservation model will be included in the serialized output.
        @extra_kwargs: Additional settings for specific fields, such as setting 'guest' as read-only and optional, and making 'email' optional.
        """

        model = Reservation
        fields = "__all__"
        extra_kwargs = {
            "guest": {"read_only": True, "required": False},
            "email": {"required": False},
        }