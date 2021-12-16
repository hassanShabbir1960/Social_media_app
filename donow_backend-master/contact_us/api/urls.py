from django.urls import path
from .views import create_contactUS_record, get_career_groups, get_jobs
urlpatterns = [
     path('create_contact_form/', create_contactUS_record),
     path('get_career_groups/', get_career_groups),
     path('get_jobs/', get_jobs),
]