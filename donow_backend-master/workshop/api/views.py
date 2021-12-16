
from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
import json
from .models import Workshop,Lesson,Category,Rating,Enrollment,Purchased,Favorite,Discussion,DiscussionLikes,Post,PostLikes,Invoice,AddOn,Payment,HelpArticle
from .serializers import WorkshopSerializer,LessonSerializer,PurchasedSerializer,FavoriteSerializer,DiscussionSerializer,RatingSerializer,PostSerializer,InvoiceSerializer,PaymentSerializer,HelpArticleSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.db.models import Avg
from  rest_framework.pagination import LimitOffsetPagination
from users.models import details,Following
import datetime
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET','POST'])
def purchased(request):
    #user verfication to be done here/
    if request.method=='GET':
        data = request.GET.get('data', None)
        selfid = -1
        batch = 0
        if data != None:
            data = json.loads(data)
        if 'selfid' in data:
            selfid = data['selfid']
        else:
            return JsonResponse({'message': 'No id provided'}, status=status.HTTP_204_NO_CONTENT)
        if 'batch' in data:
            batch = data['batch']

        purchased_courses = Purchased.objects.all().filter(user=selfid).values_list('workshop', flat=True)
        workshops = Workshop.objects.filter(pk__in=purchased_courses)
        request.GET._mutable = True
        request.GET['limit'] = 24
        request.GET['offset'] = (batch) * 24
        paginator = LimitOffsetPagination()
        workshops = paginator.paginate_queryset(workshops, request)
        serializer = WorkshopSerializer(workshops, many=True)
        for k in serializer.data:
            k['id'] = k['pk']
            del k['pk']
            k['imageUrl'] = k['cover_image_path']
            del k['cover_image_path']
            user=User.objects.get(pk=k['user'])
            user_details=details.objects.get(user=k['user'])
            k['author']={'id' : user.pk, 'firstname':user_details.first_name,'lastname':user_details.last_name}
            del k['user']
            rating = Rating.objects.all().filter(workshop=k['id']).aggregate(Avg('rating'))['rating__avg']

            k['rating'] = rating if rating else 0
            k['enrolled'] = Enrollment.objects.all().filter(workshop=k['id']).count()
            k['sold'] = Purchased.objects.all().filter(workshop=k['id']).count()
            k['category'] = Category.objects.get(pk=k['category']).cateogry_title
            k['purchased'] = True
            k['favorite'] = Favorite.objects.all().filter(workshop=k['id'], user=selfid).exists()
            k['owned'] = k['author']['id'] == selfid
        return JsonResponse(serializer.data,safe=False)

    if request.method=='POST':#adding a new workshop
        if request.data['add']=='1':
            # add the entry in table
            serializer=PurchasedSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_201_CREATED) 
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            entry=Purchased.objects.all().get(workshop=request.data['workshop'],user=request.data['user'])
            count=entry.delete()
            return JsonResponse({'message': '{} Purchased were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST', 'GET'])
def favorites(request):
    #user verfication to be done here
    if request.method=='POST':
        entry=Favorite.objects.all().filter(workshop=request.data['workshop'],user=request.data['user']).exists()
        if not(entry):
            # add the entry in table
            serializer=FavoriteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({"status": True}, status=status.HTTP_201_CREATED)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            entry=Favorite.objects.all().get(workshop=request.data['workshop'],user=request.data['user'])
            entry.delete()
            return JsonResponse({"status": False}, status=status.HTTP_200_OK)
    elif request.method=="GET":

        data = request.GET.get('data', None)
        selfid = -1
        batch = 0
        if data!=None:
            data=json.loads(data)
        if 'selfid' in data:
            selfid = data['selfid']
        else:
            return JsonResponse({'message' : 'No id provided'}, status=status.HTTP_204_NO_CONTENT)
        if 'batch' in data:
            batch = data['batch']

        favorite_courses = Favorite.objects.all().filter(user=selfid).values_list('workshop', flat=True)
        workshops = Workshop.objects.all().filter(pk__in=favorite_courses)
        request.GET._mutable=True
        request.GET['limit']=24
        request.GET['offset']=(batch)*24
        paginator = LimitOffsetPagination()
        workshops = paginator.paginate_queryset(workshops, request)
        serializer=WorkshopSerializer(workshops,many=True)
        for k in serializer.data:
            k['id']=k['pk']
            del k['pk']
            k['imageUrl']=k['cover_image_path']
            del k['cover_image_path']
            user=User.objects.get(pk=k['user'])
            user_details=details.objects.get(user=k['user'])
            k['author']={'id' : user.pk, 'firstname':user_details.first_name,'lastname':user_details.last_name}
            del k['user']
            rating=Rating.objects.all().filter(workshop=k['id']).aggregate(Avg('rating'))['rating__avg']

            k['rating']= rating if rating else 0
            k['enrolled']=Enrollment.objects.all().filter(workshop=k['id']).count()
            k['sold']=Purchased.objects.all().filter(workshop=k['id']).count()
            k['category']=Category.objects.get(pk=k['category']).cateogry_title
            k['purchased']=Purchased.objects.all().filter(workshop=k['id'],user=selfid).exists()
            k['favorite']=True
            k['owned'] = k['author']['id'] == selfid
        return JsonResponse(serializer.data,safe=False)


@api_view(['GET'])
def creators(request):
    # users=User.objects.all().values()
    data=request.GET.get('data','{}')
    data=json.loads(data)
    try:
        search=data['searchValue']
    except:
        search=""
    users=User.objects.all().filter(is_superuser=False,username__icontains=search).values('id','username')
    users_first=details.objects.all().filter(first_name__icontains=search).values('user')
    users_last=details.objects.all().filter(last_name__icontains=search).values('user')
    
    users_f_l=users_first | users_last
    users_f_l=User.objects.filter(pk__in=users_f_l.values_list('user')).values('id','username')
    users=users | users_f_l
    workshop_users=Workshop.objects.filter(user__in=users.values_list('pk')).only('user')
    users=User.objects.filter(pk__in=workshop_users.values_list('user')).values('id','username')
    try:
        users=users.filter(pk=data['id'])
    except:
        print("NO ID")
    ###PAGINATION
    
    try:
        batch=data['batch']
    except:
        batch=0
    print(batch)
    request.GET._mutable=True
    request.GET['limit']=24
    request.GET['offset']=(batch)*24
    paginator = LimitOffsetPagination()
    users = paginator.paginate_queryset(users, request)
    ######
    for k in users:
        try:
            user_details=details.objects.get(user=k['id'])
            try:
                k['imageUrl']=user_details.profile_image.url
            except:
                k['imageUrl']=None
            k['firstname']=user_details.first_name
            k['lastname']=user_details.last_name
            k['bio']=user_details.bio
            k['followers']=Following.objects.filter(user=k['id']).count()
            k['following']=Following.objects.filter(follower=k['id']).count()
            try:
                k['followed']=Following.objects.filter(user=k['id'],follower=data['selfid']).exists()
            except:
                k['followed']=False
        except:
            k['details']='None'



    return JsonResponse(list(users),safe=False)

@api_view(['GET'])
def return_categories(request):
    categories = Category.objects.all().values('cateogry_title')
    return JsonResponse(list(categories), safe=False)

@api_view(['GET'])
def search(request):
    if request.method=='GET':
        workshops=Workshop.objects.all()
        search=request.GET.get('data',None)
        if search!=None:

            search=json.loads(search)
            search=search['search']



            # Step 1: Get all users whose username matches search string (All Matching Users)
            users=User.objects.filter(username__icontains=search)

            # Step 2: Get user IDs from all workshops created by matching users (All Matching Creators)
            workshop_users=workshops.filter(user__in=users.values_list('pk')).only('user')

            # Step 3: Get username (change to first name) for all matched users (Step 1) that have workshops (Step 2)
            workshop_users=User.objects.filter(pk__in=workshop_users.values_list('user')).only('username').values('username')

            # Step 4: Get all workshops whose title matches search string
            workshops_title=workshops.filter(title__icontains=search).values('title')

            qset=[list(workshops_title),list(workshop_users)]
            return JsonResponse(qset,safe=False)
            
@api_view(['GET', 'POST', 'DELETE'])            
def lesson_list(request):
    if request.method=='GET':
        lessons=Lesson.objects.all()
        workshop=request.GET.get('data',None)
        if workshop!=None:
            workshop=json.loads(workshop)
            workshop=workshop['wid']
            lessons=lessons.filter(workshop_id=workshop)
        return JsonResponse(list(lessons.values('lesson_title','workshop_id','lesson_no')),safe=False)
    if request.method=='POST':
        serializer=LessonSerializer(data=request.data)
        print("##################################")
        print(request.data['lesson_video'])
        print(type(request.data['lesson_video']))

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method=='DELETE':
        lessons=Lesson.objects.all()
        id=request.GET.get('id')
        workshop=request.GET.get('workshop_id',None)
        if workshop==None and id==None:
             return JsonResponse({'message': 'No parameters given'}, status=status.HTTP_400_BAD_REQUEST)
        if workshop !=None:
            lessons=lessons.filter(workshop_id=workshop)
        if id!=None:
            lessons=lessons.filter(pk=id)
        

            

        count=lessons.delete()
        return JsonResponse({'message': '{} Workshop were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST', 'DELETE'])
def review_list(request):
    if request.method=='GET':
        data=request.GET.get('data','{}')
        if data!=None:
            data=json.loads(data)
        else:
            return JsonResponse("no data found.")
        workshop=data['workshop']
        try:
            batch=data['batch']
        except:
            batch=0
        reviews=Rating.objects.filter(workshop=workshop)
        request.GET._mutable=True
        request.GET['limit']=12
        request.GET['offset']=(batch)*12
        paginator = LimitOffsetPagination()
        reviews = paginator.paginate_queryset(reviews, request)
        serializer=RatingSerializer(reviews,many=True)

        for k in serializer.data:
            user=details.objects.get(user=k['user'])
            k['user']={'id':k['user'],'firstname':user.first_name, 'lastname': user.last_name}

        return JsonResponse(serializer.data,safe=False)
    if request.method=='POST':
        serializer=RatingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method=='DELETE':
        data=request.GET.get('data',{})
        data=json.loads(data)
        print(data)
        try:
            review=Rating.objects.get(id=data['id'])
            review.delete()
            return JsonResponse({"message":"The rating is deleted"}, status=status.HTTP_204_NO_CONTENT) 
        except:
            return JsonResponse({"message":"The rating does not exist"}, status=status.HTTP_400_BAD_REQUEST) 




@api_view(['GET', 'POST', 'DELETE'])
def workshop_list(request):
    if request.method=='GET':
        workshops=Workshop.objects.all()
        selfid = -1
        data=request.GET.get('data','{}')
        print(data)
        if data!=None:
            data=json.loads(data)
            if 'selfid' in data:
                selfid = data['selfid']
        if 'searchType' in data:
            if data['searchType'] == "Author":
                user=User.objects.get(username=data['searchValue'])
                workshops=workshops.filter(user=user)
            if data['searchType'] == "Category":
                category=Category.objects.get(cateogry_title=data['searchValue'])
                workshops=workshops.filter(category=category)
            if data['searchType'] == 'Workshop':
                workshops=workshops.filter(title__icontains=data['searchValue'])
        try:
            batch=data['batch']
        except:
            batch=0
        try:
            price=data['price']
        except:
            price=None
        if price:
                workshops=workshops.filter(price__lte=price)
        request.GET._mutable=True
        request.GET['limit']=24
        request.GET['offset']=(batch)*24
        paginator = LimitOffsetPagination()
        workshops = paginator.paginate_queryset(workshops, request)
        serializer=WorkshopSerializer(workshops,many=True)
        print(serializer.data)
        # mapping according to the front-end
        for k in serializer.data:
            k['id']=k['pk']
            del k['pk']
            k['imageUrl']=k['cover_image_path']
            del k['cover_image_path']
            user=User.objects.get(pk=k['user'])
            user_details=details.objects.get(user=k['user'])
            k['author']={'id' : user.pk, 'firstname':user_details.first_name,'lastname':user_details.last_name}
            del k['user']
            rating=Rating.objects.all().filter(workshop=k['id']).aggregate(Avg('rating'))['rating__avg']

            k['rating']= rating if rating else 0
            k['enrolled']=Enrollment.objects.all().filter(workshop=k['id']).count()
            k['sold']=Purchased.objects.all().filter(workshop=k['id']).count()
            k['category']=Category.objects.get(pk=k['category']).cateogry_title
            k['purchased']=Purchased.objects.all().filter(workshop=k['id'],user=selfid).exists()
            k['favorite']=Favorite.objects.all().filter(workshop=k['id'],user=selfid).exists()
            k['owned'] = k['author']['id'] == selfid






        return JsonResponse(serializer.data,safe=False)
    if request.method=='POST':#adding a new workshop
        # data=JSONParser.parse(request)
        print(request.data['category'])
        # x=input('')
        request.data['category'] = Category.objects.get(cateogry_title=request.data['category']).pk
        if request.data['cost_free_lesson']=='undefined':
            del request.data['cost_free_lesson']

        serializer=WorkshopSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method=='DELETE':
        workshops=Workshop.objects.all()
        user=request.GET.get('user',None)
        print(user)
        if user !=None:
            workshops=workshops.filter(user=user)
        count=workshops.delete()
        return JsonResponse({'message': '{} Workshop were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT', 'DELETE'])
def workshop_detail(request, pk,selfid):
    try: 
        workshop = Workshop.objects.filter(pk=pk) 
    except Workshop.DoesNotExist: 
        return JsonResponse({'message': 'The workshop does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        serializer = WorkshopSerializer(workshop,many=True) 
        for k in serializer.data:
            k['id']=k['pk']
            del k['pk']
            k['coverurl']=k['cover_image_path']
            del k['cover_image_path']
            user=User.objects.get(pk=k['user'])
            k['author']={'id':(user.pk),'username':user.username}
            del k['user']
            k['numberoflessons'] = k['no_of_lessons']
            del k['no_of_lessons']
            rating=Rating.objects.all().filter(workshop=k['id']).aggregate(Avg('rating'))['rating__avg']
            k['reviews']=Rating.objects.all().filter(workshop=k['id']).count()
            k['rating']= rating if rating else 0
            k['enrolled']=Enrollment.objects.all().filter(workshop=k['id'],user=selfid).exists()
            k['purchased']=Purchased.objects.all().filter(workshop=k['id'],user=selfid).exists()
            k['favorite']=Favorite.objects.all().filter(workshop=k['id'],user=selfid).exists()
            k['category']=Category.objects.get(pk=k['category']).cateogry_title
            k['owned'] = k['author']['id'] == int(selfid)
            try:
                lesson=Lesson.objects.all().get(workshop_id=k['id'],lesson_no=(k['cost_free_lesson'])).lesson_video.url
            except:
                lesson="None"
            del k['cost_free_lesson']
            k['costfreelesson']= lesson
        return JsonResponse(serializer.data,safe=False) 
 
    elif request.method == 'PUT': 
        serializer = WorkshopSerializer(workshop, data=request.data) 
        if serializer.is_valid(): 
            serializer.save() 
            return JsonResponse(serializer.data) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        workshop.delete() 
        return JsonResponse({'message': 'Workshop was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)



@api_view(['GET', 'POST', 'DELETE'])
def discussion_comments_list(request):
    if request.method=='GET':
        discussion=Discussion.objects.all()
        data=request.GET.get('data','{}')
        if data!=None:
            data=json.loads(data)
        if 'searchType' in data:
            if data['searchType'] == "Workshop":
                discussion=discussion.filter(workshop_id=data['searchValue'],parent_comment=None)
            elif data['searchType'] == "Parent":
                discussion=discussion.filter(parent_comment=data['searchValue'])
            elif data['searchType'] == "Post":
                discussion=discussion.filter(post_id=data['searchValue'])
                
           
        try:
            batch=data['batch']
        except:
            batch=0
        request.GET._mutable=True
        request.GET['limit']=12
        request.GET['offset']=(batch)*12
        paginator = LimitOffsetPagination()
        discussion = paginator.paginate_queryset(discussion, request)
        serializer=DiscussionSerializer(discussion,many=True);
        
        # mapping according to the front-end
        for k in serializer.data:
           
            k['comments']=Discussion.objects.all().filter(parent_comment=k['id']).count()
            user=details.objects.get(user=k['user_id'])
            k['user']={'id':k['user_id'],'firstname':user.first_name, 'lastname': user.last_name}
            del k['user_id']
            k['timestamp']= datetime.datetime.timestamp(datetime.datetime.strptime(k['created_at'], "%Y-%m-%dT%H:%M:%S.%f%z"))
            del k['created_at']
            k['likes']=DiscussionLikes.objects.filter(discussion=k['id']).count()
            k['liked']=DiscussionLikes.objects.filter(user_id=data['selfid']).exists()





        return JsonResponse(serializer.data,safe=False)
    if request.method=='POST':#adding a new discussion.
        serializer=DiscussionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method=='DELETE':
        pass



@api_view(['GET', 'POST', 'DELETE'])
def post_list(request):
    if request.method=='GET':
        data=request.GET.get('data','{}')
        if data!=None:
            data=json.loads(data)
        else:
            return JsonResponse("no data found.")
        posts = None
        if 'searchType' in data:
            if data['searchType'] == "Workshop":
                posts=Post.objects.filter(workshop_id=data['id'])
            elif data['searchType'] == "User":
                posts=Post.objects.filter(user=data['id'])
            elif data['searchType'] == "Post":
                posts=Post.objects.filter(pk=data['id'])
        
        try:
            batch=data['batch']
        except:
            batch=0
        request.GET._mutable=True
        request.GET['limit']=12
        request.GET['offset']=(batch)*12
        paginator = LimitOffsetPagination()
        posts = paginator.paginate_queryset(posts, request)
        serializer=PostSerializer(posts,many=True)

        for k in serializer.data:
            user=User.objects.get(pk=k['user'])
            user_details=details.objects.get(user=k['user'])
            k['user']={'id':(user.pk),'username':user.username,'firstname':user_details.first_name,'lastname':user_details.last_name,"imageURL":user_details.profile_image.url if user_details.profile_image else "None"}
            # del k['user']
            k['imageURL']=k['post_img']
            del k['post_img']
            k['body']=k['description']
            del k['description']
            k['timestamp']= datetime.datetime.timestamp(datetime.datetime.strptime(k['created_at'], "%Y-%m-%dT%H:%M:%S.%f%z"))
            del k['created_at']
            k['likes']=PostLikes.objects.filter(post=k['id']).count()
            k['liked']=PostLikes.objects.filter(user_id=data['selfid']).exists()
            k["comments"]=Discussion.objects.filter(post_id=k['id']).count()

        return JsonResponse(serializer.data,safe=False)
    if request.method=='POST':
        serializer=PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method=='DELETE':
        data=request.GET.get('data',{})
        data=json.loads(data)
        print(data)
        try:
            review=Post.objects.get(id=data['id'])
            review.delete()
            return JsonResponse({"message":"The post is deleted"}, status=status.HTTP_204_NO_CONTENT) 
        except:
            return JsonResponse({"message":"The post does not exist"}, status=status.HTTP_400_BAD_REQUEST) 


@api_view(['GET', 'POST', 'DELETE'])
def invoice_list(request):
    if request.method=='GET':
        data=request.GET.get('data','{}')
        if data!=None:
            data=json.loads(data)
        else:
            return JsonResponse("no data found.")
        if 'searchType' in data:
            if data['searchType'] == "withdraw":
                invoices=Invoice.objects.filter(user_from=data['id'],invoice_type='withdraw').values('amount','timestamp')
            elif data['searchType'] == "purchase":
                # TO DO
                invoices=Invoice.objects.filter(user_to=data['id'],invoice_type='purchase').values('amount','timestamp','workshop')
        try:
            batch=data['batch']
        except:
            batch=0
        request.GET._mutable=True
        request.GET['limit']=24
        request.GET['offset']=(batch)*24
        paginator = LimitOffsetPagination()
        invoices = paginator.paginate_queryset(invoices, request)
       
        for k in invoices:
            k['timestamp']= datetime.datetime.timestamp(datetime.datetime.strptime(str(k['timestamp'])[:str(k['timestamp']).index('+')], "%Y-%m-%d %H:%M:%S.%f"))
            if 'workshop' in k:
                print(k['workshop'])
                course=Workshop.objects.get(pk=k['workshop'])
                # print(course.pk)
        
                k['course']={'id' : course.pk, 'title':course.title,'coverurl':course.cover_image_path.url,"category":course.category.cateogry_title}


            

        return JsonResponse(list(invoices),safe=False)
    if request.method=='POST':
        # d
        request.data._mutable=True
        print(request.data)
        # x=input("")
        request.data['user_from']=request.user.id
        # request.data['amount']=
        request.data['invoice_type']=request.data['type']
        serializer=InvoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE','PUT'])
def payment_list(request):
    if request.method=='GET':
        data=request.GET.get('data','{}')
        if data!=None:
            data=json.loads(data)
        else:
            return JsonResponse("no data found.", status=status.HTTP_400_BAD_REQUEST)
        if 'user' in data:
            payments=Payment.objects.filter(user=data['user']).values()
        try:
            batch=data['batch']
        except:
            batch=0
        request.GET._mutable=True
        request.GET['limit']=24
        request.GET['offset']=(batch)*24
        paginator = LimitOffsetPagination()
        payments = paginator.paginate_queryset(payments, request)

        for k in payments:
            k["cardnumber"] = k['card_number']
            del k['card_number']
            k["securitycode"] = k['security_code']
            del k['security_code']
            print(k['expiration_date'])
            if k['expiration_date']:
                try:
                    k['expirationdate'] = datetime.datetime.timestamp(datetime.datetime.strptime(str(k['expiration_date'])[:str(k['expiration_date']).index('+')],"%Y-%m-%d %H:%M:%S"))
                except:
                    try:
                        k['expirationdate'] = datetime.datetime.timestamp(datetime.datetime.strptime(str(k['expiration_date'])[:str(k['expiration_date']).index('+')],"%Y-%m-%d %H:%M:%S.%f"))
                    except:
                        None
                del k['expiration_date']
            k['timestamp']= datetime.datetime.timestamp(datetime.datetime.strptime(str(k['timestamp'])[:str(k['timestamp']).index('+')], "%Y-%m-%d %H:%M:%S.%f"))
        return JsonResponse(list(payments),safe=False)
    if request.method=='POST':
        request.data._mutable=True
        request.data['user']=request.user.id
        serializer=PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'PUT':
        body_unicode = request.body.decode('utf-8')

        # updated_data=json.loads(body_unicode)
        id =request.data['id'][0]
        payment=Payment.objects.filter(pk=id)
        payment.update(**request.data.dict())
        return JsonResponse("updated", status=status.HTTP_201_CREATED,safe=False)



    if request.method=='DELETE':
        data=request.GET.get('data',{})
        data=json.loads(data)
        try:
            review=Payment.objects.get(id=data['id'])
            review.delete()
            return JsonResponse({"message":"The payment is deleted"}, status=status.HTTP_204_NO_CONTENT) 
        except:
            return JsonResponse({"message":"The payment does not exist"}, status=status.HTTP_400_BAD_REQUEST) 

@api_view(['GET', 'POST', 'DELETE'])
def help_article_list(request):
    if request.method=='GET':
        articles=HelpArticle.objects.all().values('article_type','topic','title','visit_frequency','id')
        data=request.GET.get('data','{}')
        if data!=None:
            data=json.loads(data)
        else:
            return JsonResponse("no data found.")
        if 'type' in data:
            articles=HelpArticle.objects.filter(article_type=data['type']).order_by('-visit_frequency').values('article_type','topic','title','visit_frequency','id')
            if 'topic' not in data:
                articles=articles[:6 if 6<len(articles) else len(articles)]
        if 'topic' in data:
            articles=articles.filter(topic__icontains=data['topic'])
        if 'id' in data:
            article=HelpArticle.objects.get(pk=data['id'])
            article.visit_frequency+=1
            article.save()
            return JsonResponse(HelpArticleSerializer(article).data,safe=False)
        
        return JsonResponse(list(articles),safe=False)
    if request.method=='POST':
        serializer=HelpArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method=='DELETE':
        data=request.GET.get('data',{})
        data=json.loads(data)
        try:
            review=HelpArticle.objects.get(id=data['id'])
            review.delete()
            return JsonResponse({"message":"The article is deleted"}, status=status.HTTP_204_NO_CONTENT) 
        except:
            return JsonResponse({"message":"The article does not exist"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_balance(request):
    if request.method=='GET':
        id=request.user.id
        # id=3
        #to - from
        to=Invoice.objects.filter(user_to=id).aggregate(Sum('amount'))
        print(to)
        _from=Invoice.objects.filter(user_from=id).aggregate(Sum('amount'))
        if to['amount__sum']==None:
            to['amount__sum']=0.0
        if _from['amount__sum']==None:
            _from['amount__sum']=0.0
        print(_from)
        balance=to['amount__sum']-_from['amount__sum']
        return JsonResponse({'balance':balance}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def follow_toggle(request,user):
    follower=request.user.id
    # follower=1
    # print(type(follower),type(user))
    if int(follower)==int(user):
        return JsonResponse({"message":"Cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
    if Following.objects.filter(user=user,follower=follower).exists():
        Following.objects.filter(user=user,follower=follower).delete()
        return JsonResponse({"message":"unfollowed"}, status=status.HTTP_200_OK)
    else:
        new_instance=Following(user=User.objects.get(pk=user),follower=User.objects.get(pk=follower))
        new_instance.save()
        return JsonResponse({"message":"followed"}, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def toggle_post_like(request,post):
    user=request.user.id
    print(request.user)
    # user=1
    if PostLikes.objects.filter(user=user,post=post).exists():
        PostLikes.objects.filter(user=user,post=post).delete()
        return JsonResponse({"status":False}, status=status.HTTP_200_OK)
    else:
        new_instance=PostLikes(user=User.objects.get(pk=user),post=Post.objects.get(pk=post))
        new_instance.save()
        return JsonResponse({"status":True}, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def toggle_discussion_like(request,diss):
    user=request.user.id
    # user=1
    if DiscussionLikes.objects.filter(user=user,discussion=diss).exists():
        DiscussionLikes.objects.filter(user=user,discussion=diss).delete()
        return JsonResponse({"status":False}, status=status.HTTP_200_OK)
    else:
        new_instance=DiscussionLikes(user=User.objects.get(pk=user),discussion=Discussion.objects.get(pk=diss))
        new_instance.save()
        return JsonResponse({"status":True}, status=status.HTTP_200_OK)

