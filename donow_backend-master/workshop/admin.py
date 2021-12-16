from django.contrib import admin
from .api.models import PostLikes,Workshop,Lesson,Category,Rating,Enrollment,Purchased,Favorite,Discussion,DiscussionLikes,Post,Invoice,Payment,HelpArticle
# from .api.models import HelpArticle
# Register your models here.


admin.site.register(Workshop)
admin.site.register(Lesson)
admin.site.register(Category)
admin.site.register(Rating)
admin.site.register(Enrollment)
admin.site.register(Purchased)
admin.site.register(Favorite)
admin.site.register(Discussion)
admin.site.register(DiscussionLikes)
admin.site.register(Post)
admin.site.register(Invoice)
admin.site.register(Payment)
admin.site.register(HelpArticle)
admin.site.register(PostLikes)