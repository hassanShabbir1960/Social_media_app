from rest_framework import generics, status
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.http.response import JsonResponse
from users.api.serializers import UserDetailSerializer
from .serializers import UserSerializer, RegisterSerializer, LoginSerialzer
from utilities.tokens import account_activation_token
from utilities.helperMethods import sendActivationEmail
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from users.models import details
import _thread
from rest_framework import serializers


#Register Api
class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):

        user_details = {
            "first_name": request.data.pop("firstname"),
            "last_name": request.data.pop("lastname"),
        }

        if 'bio' in request.data and request.data['bio']:
            user_details['bio'] = request.data.pop("bio")
        # print (user_details)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception = True)
        user = serializer.save()
        user.is_active=False
        user.save()

        user_details['user'] = user.id
        serializer = UserDetailSerializer(data=user_details)
        if serializer.is_valid():
            # print(serializer)
            serializer.save()
        #     return JsonResponse({'message': 'The User Detail Record created'}, status=status.HTTP_201_CREATED)
        # return JsonResponse({'message': 'The User Detail Record creation failed'}, status=status.HTTP_400_BAD_REQUEST)
        # token, created = Token.objects.get_or_create(user=user)
        # current_site = get_current_site(request)
        _thread.start_new_thread(sendActivationEmail, (user,))
        # email = EmailMessage(mail_subject, message,"no_reply@donow.com",to=[to_email],)
        # email.send()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "msg": "Activation Required"
        })
        # return Response({
        #     "user": UserSerializer(user, context=self.get_serializer_context()).data,
        #     "token": token.key
        # })

class AdminLoginApi(generics.GenericAPIView):
    serializer_class = LoginSerialzer

    def post(self, request, *args, **kwargs):
        if User.objects.get(username=request.data['username']).is_superuser:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            final_user = UserSerializer(user, context=self.get_serializer_context()).data
            final_user['user_status'] = "admin"
            return Response({
                "user": final_user,
                "token": token.key,
            })
        else:
            print("non-admin user")
            return Response("Non Admin Users not allowed.", status.HTTP_400_BAD_REQUEST)

#Login Api
class LoginApi(generics.GenericAPIView):
    serializer_class = LoginSerialzer

    def post(self, request, *args, **kwargs):
        if not User.objects.get(username=request.data['username']).is_superuser:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            final_user = UserSerializer(user, context=self.get_serializer_context()).data
            final_user['user_status'] = "nonadmin"
            return Response({
                "user": final_user,
                "token": token.key,
            })
        else:
            print("admin user")
            return Response("Admin Users not allowed.", status.HTTP_400_BAD_REQUEST)



#GetUSer Api
# class UserApi(generics.RetrieveAPIView):
#     permission_classes = [
#         permissions.IsAuthenticated,
#     ]
#     serializer_class = UserSerializer
#
#     def get_object(self):
#         print(self.request.user)
#         # return {"bakwas": "bakwas na kar"}

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UserApi(request):
    # print(request.user.id)
    userObject = User.objects.get(pk=request.user.id)
    user_status = ""
    if userObject.is_superuser:
        user_status = "admin"
    else:
        user_status = "nonadmin"
    user = {
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
    }
    detailObject = details.objects.get(user=request.user.id)
    serializer = UserDetailSerializer(detailObject)
    user['first_name'] = detailObject.first_name
    user['profile_image'] = serializer.data['profile_image']
    user['user_status'] = user_status

    return JsonResponse(user, status=status.HTTP_200_OK)


class VerificationView(generics.GenericAPIView):
    def get(self, request, uidb64, token):
        try:
            id = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=id)

            if not account_activation_token.check_token(user, token):
                 return redirect("http://localhost:3000/login")

            if user.is_active:
                return redirect("http://localhost:3000/login")
            user.is_active = True
            user.save()

            # messages.success(request, 'Account activated successfully')
            return  redirect("http://localhost:3000/login")

        except Exception as ex:
            print(ex)

        return  redirect("http://localhost:3000/login")
