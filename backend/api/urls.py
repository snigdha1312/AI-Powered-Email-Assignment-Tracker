from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'assignments', views.AssignmentViewSet, basename='assignment')

urlpatterns = [
    path('', include(router.urls)),
    path('emails/sync/', views.sync_emails, name='sync_emails'),
]
