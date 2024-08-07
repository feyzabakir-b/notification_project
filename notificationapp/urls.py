from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, index

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', index, name='index'), 
    path('api/', include(router.urls)),  
]
