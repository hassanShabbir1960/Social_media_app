import _thread
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..models import details
from .serializers import UserDetailSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from utilities.helperMethods import sendActivationEmail


@api_view(['POST'])
def user_details_update(request):
    # print(request.data)
    try:
        user_detail = details.objects.get(user=request.user.id)
        user = User.objects.get(id=request.user.id)
    except details.DoesNotExist:
        return JsonResponse({'message': 'The User or User Detail Record does not exist'}, status=status.HTTP_404_NOT_FOUND)

    Error = []
    data = []
    '''Popping irrelevant information for user detail serializer which will be used by authUser updates'''
    userAuth = {}
    userAuth['username'] = request.data['username']
    userAuth['email'] = request.data['email']

    '''deactivate user on email change'''
    if (userAuth['email'] != request.user.email):
        user.is_active = False
        user.save()



    '''User Updating'''
    serializer = UserSerializer(user, data=userAuth)
    if serializer.is_valid():
        serializer.save()
        data.append(serializer.data)
    else:
         Error.append(serializer.errors)
    if (request.data['new_password']):
        user.set_password(request.data['new_password'])
        user.save()

    if (not user.is_active):
        _thread.start_new_thread(sendActivationEmail, (user,))

    userDetails = {
        "first_name": request.data['first_name'],
        "last_name": request.data['last_name'],
        "bio": request.data['bio'] if request.data['bio'] != "null" else None,
        "age": request.data['age'] if request.data['age'] != "null" else None,
        "location": request.data['location'] if request.data['location'] != "null" else None,
        "facebook_profile": request.data['facebook_profile'] if request.data['facebook_profile'] != "null" else None,
        "instagram_profile": request.data['instagram_profile'] if request.data['instagram_profile'] != "null" else None,
        "youtube_profile": request.data['youtube_profile'] if request.data['youtube_profile'] != "null" else None,
        "pinterest_profile": request.data['pinterest_profile'] if request.data['pinterest_profile'] != "null" else None,
        "twitter_profile": request.data['twitter_profile'] if request.data['twitter_profile'] != "null" else None,

    }

    '''User Detail Updating'''
    if (not request.data['profile_image'] and user_detail.profile_image):
            userDetails['profile_image'] = user_detail.profile_image
    else:
        userDetails['profile_image'] = request.data['profile_image'] if request.data['profile_image'] != "null" else None


    userDetails['user'] = request.user.id
    serializer = UserDetailSerializer(user_detail, data=userDetails)
    if serializer.is_valid():
        serializer.save()
        data.append(serializer.data)
        return JsonResponse({"Data": data})
    Error.append(serializer.errors)
    return JsonResponse({"Error": Error}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
def password_check(request):
    user = User.objects.get(id=request.user.id)
    res = user.check_password(request.data['password'])
    return JsonResponse({"status":res, "password": user.password}, status=status.HTTP_200_OK)

@api_view(['POST'])
def password_change(request):
    user = User.objects.get(id=request.user.id)
    if (request.data['password']):
        user.set_password(request.data['password'])
        user.save()
    res = user.password
    return JsonResponse({"status":res}, status=status.HTTP_200_OK)



@api_view(['GET'])
def username_check(request):
    if User.objects.exclude(id=request.user.id).filter(username=request.GET.get('data')).exists():
        return JsonResponse({"status": False}, status=status.HTTP_200_OK)
    return JsonResponse({"status": True}, status=status.HTTP_200_OK)

@api_view(['GET'])
def email_check(request):
    if User.objects.exclude(id=request.user.id).filter(email=request.GET.get('data')).exists():
        return JsonResponse({"status": False}, status=status.HTTP_200_OK)
    return JsonResponse({"status": True}, status=status.HTTP_200_OK)





@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_details(request):
    user_id = request.GET.get('data', None)
    if not user_id:
        user_id = request.user.id

    try:
        user = User.objects.get(id = user_id)
        user_detail = details.objects.get(user=user_id)
    except details.DoesNotExist:
        return JsonResponse({'message': 'The User Detail Record does not exist'}, status=status.HTTP_404_NOT_FOUND)

    user_status = ""
    if user.is_superuser:
        user_status = "admin"
    else:
        user_status = "nonadmin"

    if request.method == 'GET':
        detail_serializer = UserDetailSerializer(user_detail)
        user_serializer = UserSerializer(user)
        data = {
            "user_details": detail_serializer.data,
            "user": user_serializer.data,
            "user_status": user_status
        }
        # data['followers'] = Following.objects.filter(user=data['user']).count()
        # data['following'] = Following.objects.filter(follower=data['user']).count()
        # try:
        #     data['followed'] = Following.objects.filter(user=data['user'], follower=request.user.id).exists()
        # except:
        #     data['followed'] = False
        return JsonResponse(data)

    if request.method == 'DELETE':
        user_detail.delete()
        return JsonResponse({'message': 'User Details Record was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
