from django.contrib import admin

# Register your models here.

from .api.models import contactUS, contactUsAttachments, CareerGroup, Jobs

class contactAttachmentsAdmin(admin.StackedInline):
    model = contactUsAttachments

@admin.register(contactUS)
class contactUsAdmin(admin.ModelAdmin):
    inlines = [contactAttachmentsAdmin]

    class Meta:
        model = contactUS


@admin.register(contactUsAttachments)
class contactAttachmentsAdmin(admin.ModelAdmin):
    pass

admin.site.register(CareerGroup)
admin.site.register(Jobs)
