from django.urls import path, include
from .views import RegisterApi, LoginApi, AdminLoginApi, UserApi,VerificationView

urlpatterns = [
    path('rest-auth/admin-login', AdminLoginApi.as_view()),
    path('rest-auth/login', LoginApi.as_view()),
    path('social-auth/', include('allauth.urls')),
    path('rest-auth/register', RegisterApi.as_view()),
    path('rest-auth/user', UserApi),
    path('activate/<uidb64>/<token>',
         VerificationView.as_view(), name='activate'),
    path('rest-auth/', include('rest_auth.urls')),

    # path('rest-auth/register/', include('rest_auth.registration.urls')),
]