from django.db import models
from user_management.user_management_models.user_models import User
from user_management.user_management_models.custom_permissions_model import (
    CustomPermissions,
)

##################################################################################
# CUSTOM USER PERMISSIONS MODEL
##################################################################################


class CustomUserPermissions(models.Model):
    user_permission_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, to_field="username", on_delete=models.DO_NOTHING, null=False
    )
    permission = models.ForeignKey(
        CustomPermissions,
        to_field="permission_id",
        on_delete=models.DO_NOTHING,
        null=False,
    )

    # provide user frendly names in Django Admin Console
    def __str__(self):
        ret = "{0} ({1})".format(self.user, self.permission)
        return ret

    class Meta:
        # setting the model name in Django Admin Console
        verbose_name_plural = "User Permissions"
        constraints = [
            models.UniqueConstraint(
                name="one_username_per_permission_id_instance",
                fields=["user", "permission"],
            )
        ]
