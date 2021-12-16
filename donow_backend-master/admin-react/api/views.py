
from django.http import JsonResponse
from rest_framework.response import Response

from workshop.api.models import Workshop, Category, Lesson
from .serializers import WorkshopSerializer,LessonSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from utilities.helperMethods import removeFiles
import _thread
from  rest_framework.pagination import LimitOffsetPagination



@api_view(['GET'])
def pending_workshops(request):
    if request.method == 'GET':
        workshops = Workshop.objects.filter(approved=False)
        # batch = 0
        # request.GET._mutable = True
        # request.GET['limit'] = 2
        # request.GET['offset'] = (batch) * 2
        # paginator = LimitOffsetPagination()
        # workshops = paginator.paginate_queryset(workshops, request)
        serializer = WorkshopSerializer(workshops, many=True)
        for k in serializer.data:
            k['id']=k['pk']
            del k['pk']
            k['imageUrl']=k['cover_image_path']
            del k['cover_image_path']
            user=User.objects.get(pk=k['user'])
            k['author']={'id':(user.pk),'username':user.username}
            del k['user']
            k['category']=Category.objects.get(pk=k['category']).cateogry_title
        return JsonResponse(serializer.data,safe=False)

@api_view(['GET'])
def get_lessions(request):
    lessons= Lesson.objects.filter(workshop_id=request.GET.get('data'))
    serializer = LessonSerializer(lessons, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['DELETE'])
def reject_pending_workshop(request):

    try:
        workshop = Workshop.objects.get(id=request.GET.get('data'))
        print(workshop)

    except:
        return Response({"Workshop Not Found"})
    # print(workshop.cover_image_path.path)
    paths = []
    paths.append(workshop.cover_image_path.path)
    lessons = Lesson.objects.filter(workshop_id=workshop.id)
    for l in lessons:
        paths.append(l.lesson_video.path)

    #removing files
    print(paths)
    _thread.start_new_thread(removeFiles, (paths,))

    try:
        workshop.delete()
        return Response({"Workshop Deleted"})
    except:
        return Response({"Deletion Failed"})

@api_view(['POST'])
def approve_pending_workshop(request):
    workshop = Workshop.objects.get(id=request.data['id'])
    if workshop.approved:
        print("true")
        return Response({"Already Approved"})
    else:
        print("false")
    try:
        workshop.approved = True
        workshop.save()
        return Response({"approved"})
    except:
        return Response({"failed approving"})





