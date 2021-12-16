from workshop.api.models import Workshop, Lesson
from rest_framework import serializers


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('workshop_id', 'lesson_title', 'lesson_no', 'lesson_video')

class WorkshopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ('title', 'description', 'category','no_of_lessons','level','price','cost_free_lesson','cover_image_path','created_on','approved','user','pk')