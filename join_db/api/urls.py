from django.contrib import admin
from django.urls import path, include
from .views import UserViewSet, ContactViewSet, TaskViewSet
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'users', UserViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]