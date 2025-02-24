from django.contrib import admin
from django.urls import path, include
from .views import ContactViewSet, TaskViewSet, SummaryView, UserProfileList, UserProfileDetail, RegistrationView
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

router = routers.SimpleRouter()
router.register(r'contacts', ContactViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('summary-task/', SummaryView.as_view()),
    path('users/', UserProfileList.as_view(), name='users-list'),
    path('user/<int:pk>/', UserProfileDetail.as_view(), name='user-detail'),
    path('registration/', RegistrationView.as_view(), name='registration-detail'),
]