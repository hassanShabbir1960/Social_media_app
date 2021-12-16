from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import render, redirect

#user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

#register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email','password')
        extra_kwargs = {'password': {'write_only': True}}


    def create(self, validated_data):

        user  = User.objects.create_user(validated_data['username'], validated_data['email'] ,validated_data['password'])

        return user

#login serializer

class LoginSerialzer(serializers.Serializer):
    username  = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user1=""
        try:
            username=data['username']
            user1=User.objects.get(username=username)
        except:
            raise serializers.ValidationError("Incorrect Username.This user does not exists")
        if user1!="" and user1.is_active==False:
                # redirect("http://google.com")
                raise serializers.ValidationError("Account Not Activated")
       
           

        user = authenticate(**data)
        
        if user and user.is_active:
            return user
        elif user and not(user.is_active):
            raise serializers.ValidationError("Account Not Activated")
        else:
            raise serializers.ValidationError("Incorrect Username OR Password")

