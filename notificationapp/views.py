from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        notification = serializer.save()
        self.send_notification_via_websocket(notification)

    def send_notification_via_websocket(self, notification):
        channel_layer = get_channel_layer()
        group_name = f"user_{notification.user.id}"
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_notification',
                'message': notification.message,
            }
        )

def index(request):
    return render(request, 'notifications/index.html')
