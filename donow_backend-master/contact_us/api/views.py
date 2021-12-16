from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import ContactUsSerializer, ContactUsAttachmentSerializer, JobSerializer
from .models import contactUS, CareerGroup, Jobs
from utilities.helperMethods import removeFiles
import _thread



@api_view(['GET'])
def get_career_groups(request):
    try:
        careers = []
        careersObject = CareerGroup.objects.all()
        for c in careersObject:
            careers.append(c.name)
        return JsonResponse({"careers": careers}, status=status.HTTP_200_OK)
    except:
        return JsonResponse({"error": "error"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_jobs(request):
    career = CareerGroup.objects.get(name=request.GET.get('data'))
    # print(career)
    try:
        # jobs = []
        jobsObject = Jobs.objects.filter(career_group=career)
        serializer = JobSerializer(jobsObject, many=True)
        print(serializer.data)
        return JsonResponse(serializer.data, safe=False)
        # for c in jobsObject:
        #     jobs.append(c.name)
        #     print(c.name)
        # return JsonResponse({"jobs": jobsObject}, status=status.HTTP_200_OK)
    except:
        return JsonResponse({"error": "error"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_contactUS_record(request):
    data = []
    contact_us = {
        'email': request.data['email'],
        'subject': request.data['subject'],
        'description': request.data['description'],
        'issue': request.data['issue'],
        'attachment': request.data['attachment0']
    }
    try:
        serializer = ContactUsSerializer(data=contact_us)
        if serializer.is_valid():
            serializer.save()
            data.append(serializer.data)
        contact_us_object = contactUS.objects.get(id=serializer.data['id'])

        print(contact_us_object)
        print(request.data['attachment_length'])
        for i in range(int(request.data['attachment_length'])-1):
            attachment = {
                'contact_form': contact_us_object.pk,
                'attachment': request.data['attachment'+str(i+1)]
            }
            serializer = ContactUsAttachmentSerializer(data=attachment)
            if serializer.is_valid():
                serializer.save()
                data.append(serializer.data)
            else:
                print('attachments error')
        return JsonResponse({"data":"ok"}, status=status.HTTP_201_CREATED)
    except:
        contact_us_object.delete()
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
