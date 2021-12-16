from django.contrib import admin
from django.urls import path, include
from .views import user_details, user_details_update, password_check, username_check, email_check,\
    password_change

urlpatterns = [
    path('', user_details),
    path('update/', user_details_update),
    path('password_validation/', password_check),
    path('password_change/', password_change),
    path('username_validation/', username_check),
    path('email_validation/', email_check),
]