from rest_framework import serializers
from user_management.user_management_models.custom_permissions_model import (
    CustomPermissions,
)


# Serializers define the API representation
class GetPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomPermissions
        fields = "__all__"


# Serializers define the API representation
# class GetCustomPermissionsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomPermissions
#         fields = ["en_name", "fr_name", "en_description", "fr_description"]
