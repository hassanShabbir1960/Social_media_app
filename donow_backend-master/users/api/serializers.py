from django.contrib.auth.models import User
from ..models import details
from rest_framework import serializers



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = details
        fields = '__all__'