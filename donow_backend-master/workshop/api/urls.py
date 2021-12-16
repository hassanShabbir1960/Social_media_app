from django.urls import path, include
from .views import workshop_list,search,lesson_list, return_categories,creators,purchased,favorites,discussion_comments_list,workshop_detail,review_list
from .views import post_list,invoice_list,payment_list,help_article_list,get_balance,follow_toggle,toggle_discussion_like,toggle_post_like
urlpatterns = [
    
     path('list/', workshop_list),
     path('search/', search),
     path('lesson/', lesson_list),
     path('fetchCategories/', return_categories),
     path('fetchCreators/',creators),
     path('purchased/',purchased),
     path('favorite/',favorites),
     path('discussions/',discussion_comments_list),
     path('id/<pk>/<selfid>',workshop_detail),
     path('review/',review_list),
     path('post/',post_list),
     path('invoices/',invoice_list),
     path('payment/',payment_list),
     path('help_articles/',help_article_list),
      path('balance/',get_balance),
      path('follow/<user>',follow_toggle),
      path('like_discussion/<diss>',toggle_discussion_like),
      path('like_post/<post>',toggle_post_like),
     # path('rest-auth/user', UserApi.as_view()),
    # path('activate/<uidb64>/<token>',
    #      VerificationView.as_view(), name='activate'),
    # path('rest-auth/', include('rest_auth.urls')),

    # path('rest-auth/registration/', include('rest_auth.registration.urls')),
]