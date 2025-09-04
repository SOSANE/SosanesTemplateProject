from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db import IntegrityError
from django.db.models import Q
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from user_management.user_management_models.user_models import User
from user_management.user_management_models.custom_user_permissions_models import (
    CustomUserPermissions,
)
from user_management.user_management_models.custom_permissions_model import (
    CustomPermissions,
)
from user_management.views.utils import is_undefined
from user_management.serializers.get_permissions_serializer import (
    GetPermissionsSerializer,
)

# getting existing permissions
class GetPermissions(APIView):
    def get(self, request):
        return Response(get_existing_permissions(request))

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


def get_existing_permissions(request):
    custom_permissions = CustomPermissions.objects.all()
    serialized = GetPermissionsSerializer(custom_permissions, many=True)
    return serialized.data


# checking if the specified user is a TA
class GetUserPermissions(APIView):
    def get(self, request):
        username = request.query_params.get("username", None)
        if is_undefined(username):
            return JsonResponse({"error": "no 'username' parameter"})
        try:
            user = User.objects.get(username=username)
        except ObjectDoesNotExist:
            return Response({"The specified username does not exist"})
        # get permissions of the specified user
        custom_user_permissions = CustomUserPermissions.objects.filter(
            Q(user=user)
        ).all()
        # if the specified user is a candidate (no permission)
        if not custom_user_permissions:
            return Response({"No Permission"})
        # any other types of user with permission(s)
        else:
            # initializing array that will contain the user permissions
            json_object_array = []
            # looping in user permissions
            for user_permission in custom_user_permissions:
                # getting all permissions for the specified user based on the permission_id
                custom_permissions = CustomPermissions.objects.filter(
                    Q(permission_id=user_permission.permission_id)
                ).all()
                # looping in permissions
                for permission in custom_permissions:
                    # getting all needed fields
                    permission_id = permission.permission_id
                    en_name = permission.en_name
                    fr_name = permission.fr_name
                    en_description = permission.en_description
                    fr_description = permission.fr_description
                    codename = permission.codename
                    # saving results in a json object
                    json_object = {
                        "permission_id": permission_id,
                        "en_name": en_name,
                        "fr_name": fr_name,
                        "en_description": en_description,
                        "fr_description": fr_description,
                        "codename": codename,
                    }
                    # pushing results in the array
                    json_object_array.append(json_object)
            return JsonResponse(json_object_array, safe=False)



# getting pending permissions (permissions that have been requested, but not approved yet)
class GetPendingPermissions(APIView):
    def get(self, request):
        return get_pending_permissions(request)

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


# getting available permissions (for permission requests)
# available permissions: permissions that are not in user' permissions and/or in user' pending permissions
class GetAvailablePermissionsForRequest(APIView):
    def get(self, request):
        return get_available_permissions(request)

    # def get_permissions(self):
    #     return [permissions.IsAuthenticated()]


