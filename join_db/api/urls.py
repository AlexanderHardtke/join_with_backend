from django.contrib import admin
from django.urls import path, include
from .views import UserViewSet
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]