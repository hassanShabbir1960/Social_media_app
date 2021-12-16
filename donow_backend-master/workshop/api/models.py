from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from datetime import datetime

# Create your models here.
from rest_framework.reverse import reverse


class Category(models.Model):
    category_img=models.ImageField(upload_to=settings.MEDIA_ROOT+'category_images')
    cateogry_title=models.CharField(max_length=30)


class Workshop(models.Model):

    #feilds
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    approved=models.BooleanField(default=False)
    title=models.CharField(max_length=30)
    description=models.CharField(max_length=200)
    level_choice=(
        ("Easy","Easy"),
        ("Medium","Medium"),
        ("Difficult","Difficult")
        )
    category=models.ForeignKey(Category,on_delete=models.CASCADE,null=True)
    no_of_lessons=models.IntegerField()
    level=models.CharField(choices=level_choice,default="BEG",max_length=20)
    price=models.FloatField()
    cost_free_lesson=models.IntegerField(null=True,default=None,blank=True)
    created_on = models.DateTimeField(default=datetime.now)
    cover_image_path=models.ImageField(upload_to=settings.MEDIA_ROOT+'cover_images')
    #functions
    def get_absolute_url(self):
        return reverse('workshops', args=[str(self.id)])
    def __str__(self):
        return self.title

class Post(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    description=models.CharField(max_length=30)
    post_img=models.ImageField(upload_to=settings.MEDIA_ROOT+'posts')
    workshop_id=models.ForeignKey(Workshop,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
class Lesson(models.Model):
    workshop_id=models.ForeignKey(Workshop,on_delete=models.CASCADE)
    lesson_no=models.IntegerField()
    lesson_title=models.CharField(max_length=50)
    lesson_video=models.FileField(upload_to=settings.MEDIA_ROOT+'lessons')

class Rating(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,)
    workshop=models.ForeignKey(Workshop,on_delete=models.CASCADE)
    ratings=(
        (1,1),
        (2,2),
        (3,3),
         (4,4),
         (5,5)  
        )
    rating=models.IntegerField(choices=ratings,default=5)
    body=models.CharField(max_length=200)

class Enrollment(models.Model):
    class Meta:
        unique_together = (('user', 'workshop'),)
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    workshop=models.ForeignKey(Workshop,on_delete=models.CASCADE,null=True)

class Purchased(models.Model):
    class Meta:
        unique_together = (('user', 'workshop'),)
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    workshop=models.ForeignKey(Workshop,on_delete=models.CASCADE,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

class Favorite(models.Model):
    class Meta:
        unique_together = (('user', 'workshop'),)
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    workshop=models.ForeignKey(Workshop,on_delete=models.CASCADE,null=True)

class Discussion(models.Model):
    workshop_id=models.ForeignKey(Workshop,on_delete=models.CASCADE,null=True,blank=True)
    user_id=models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    parent_comment=models.ForeignKey('self',null=True,default=None,on_delete=models.CASCADE,blank=True)
    body=models.CharField(max_length=200)
    post_id=models.ForeignKey(Post,on_delete=models.CASCADE,null=True,blank=True)


class DiscussionLikes(models.Model):
    class Meta:
        unique_together = (('user', 'discussion'),)
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    discussion=models.ForeignKey(Discussion,on_delete=models.CASCADE,null=True)

class PostLikes(models.Model):
    class Meta:
        unique_together = (('user', 'post'),)
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    post=models.ForeignKey(Post,on_delete=models.CASCADE,null=True)

class AddOn(models.Model):
    name=models.CharField(max_length=30)


class Invoice(models.Model):
    invoice_type=models.CharField(max_length=30)
    amount=models.FloatField()
    user_from=models.ForeignKey(User,on_delete=models.CASCADE,null=True,related_name='user_from')
    user_to=models.ForeignKey(User,on_delete=models.CASCADE,null=True,related_name='user_to',blank=True)
    workshop=models.ForeignKey(Workshop,on_delete=models.CASCADE,null=True,blank=True)
    add_on=models.ForeignKey(AddOn,on_delete=models.CASCADE,null=True,blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class Payment(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    payment_choice=(
        ("visa","visa"),
        ("paypal","paypal"),)
    
    payment=models.CharField(choices=payment_choice,default="visa",max_length=20)
    email=models.EmailField(null=True,blank=True)
    card_number=models.IntegerField(null=True,blank=True)
    expiration_date=models.DateTimeField(blank=True,null=True)
    security_code=models.IntegerField(null=True,blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class HelpArticle(models.Model):
    type_choice=(
        ("student","student"),
        ("instructor","instructor"),)
    
    article_type=models.CharField(choices=type_choice,default="student",max_length=20)
    topic=models.CharField(max_length=20)
    title=models.CharField(max_length=100)
    body=models.CharField(max_length=1500)
    # isFAQ=models.BooleanField()
    visit_frequency=models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    
