from django.contrib import admin
from user_management.user_management_models.custom_permissions_model import (
    CustomPermissions,
)
from user_management.user_management_models.custom_user_permissions_models import (
    CustomUserPermissions,
)

# Register your models here.
admin.site.register(CustomPermissions)
admin.site.register(CustomUserPermissions)
