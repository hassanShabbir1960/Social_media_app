from django.urls import path
from .views import pending_workshops, get_lessions, approve_pending_workshop, reject_pending_workshop

urlpatterns = [
    path('pending-workshops/', pending_workshops),
    path('get-lessons/', get_lessions),
    path('approve-workshop/', approve_pending_workshop),
    path('reject-workshop/', reject_pending_workshop),
]