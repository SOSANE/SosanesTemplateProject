from django.db import models
from django.contrib.contenttypes.models import ContentType

##################################################################################
# CUSTOM PERMISSIONS MODEL
##################################################################################


class CustomPermissions(models.Model):
    permission_id = models.AutoField(primary_key=True)
    en_name = models.CharField(
        default="default", max_length=75, blank=False, null=False
    )
    fr_name = models.CharField(
        default="default", max_length=75, blank=False, null=False
    )
    en_description = models.CharField(max_length=255, blank=False, null=False)
    fr_description = models.CharField(max_length=255, blank=False, null=False)
    codename = models.CharField(max_length=25, unique=True, blank=False, null=False)
    content_type = models.ForeignKey(
        ContentType, to_field="id", on_delete=models.DO_NOTHING, null=False
    )
    date_assigned = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    expiry_date = models.DateTimeField(auto_now_add=False, blank=True, null=True)

    # provide user frendly names in Django Admin Console
    def __str__(self):
        ret = self.en_name
        return str(ret)

    class Meta:
        # setting the model name in Django Admin Console
        verbose_name_plural = "Permissions"
        constraints = [
            models.UniqueConstraint(
                name="must_be_a_unique_codename", fields=["codename"]
            )
        ]
