
from .models import Workshop,Lesson,Purchased,Favorite,Discussion,Rating,Post,Invoice,Payment,HelpArticle
from rest_framework import serializers

class HelpArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpArticle
        fields =  '__all__'
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields =  '__all__'
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields =  '__all__'
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields =  '__all__'
class DiscussionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussion
        fields =  '__all__'
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields =  '__all__'
class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ('user','workshop')

class PurchasedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchased
        fields = ('user','workshop')

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('workshop_id','lesson_title','lesson_no','lesson_video')
class WorkshopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ('title', 'description', 'category','no_of_lessons','level','price','cost_free_lesson','cover_image_path','approved','user','pk')