from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    """
    Date: (August 8th, 2024)
    Author: Porfirio Tavira
    Description: This serializer handles the conversion of User model instances to and from JSON format. 
    It manages the validation and serialization of user-related data, particularly for registration and user profile updates.
    """

    class Meta:
        """
        Description: Meta class defining the model and fields for the serializer.
        @model: The model associated with this serializer is the built-in User model.
        @fields: The fields to be serialized are 'id', 'email', 'password', 'first_name', and 'last_name'.
        @extra_kwargs: Additional configurations for specific fields. 
        The 'password' field is write-only, ensuring it is not exposed in responses.
        The 'email', 'first_name', and 'last_name' fields are required for user creation.
        """
        
        model = User
        fields = ["id", "email", "password", "first_name", "last_name"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def create(self, validated_data):
        """
        @param validated_data: Dictionary containing validated user data
        @return: User object
        Description: This method creates a new User instance with the validated data, 
        particularly handling password hashing and user creation.
        """

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user