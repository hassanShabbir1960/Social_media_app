from rest_framework import serializers
from .models import contactUS, contactUsAttachments, CareerGroup, Jobs


class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = contactUS
        fields =  '__all__'


class ContactUsAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = contactUsAttachments
        fields = '__all__'

class CareerGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerGroup
        fields =  '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields =  '__all__'

