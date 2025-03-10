from rest_framework import viewsets, mixins, generics
from join_db.models import Contact, Task, UserProfile
from .serializers import UserProfileSerializer, ContactSerializer, TaskSerializer, CheckUserListSerializer
from rest_framework.response import Response
from .serializers import RegistrationSerializer
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


class CheckUserList(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Contact.objects.all()
    serializer_class = CheckUserListSerializer


class UserProfileList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserLogin(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        data = {}
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            data = {
                'token': token.key,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        else:
            data=serializer.errors

        return Response(data)


class RegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)

        data = {}
        if serializer.is_valid():
            saved_account = serializer.save()
            token, created = Token.objects.get_or_create(user=saved_account)
            data = {
                'token': token.key,
                'username': saved_account.username,
                'first_name': saved_account.first_name,
                'last_name': saved_account.last_name,
            }
        else:
            data=serializer.errors

        return Response(data)


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def list(self, request):
        user = request.user.first_name + " " + request.user.last_name
        if user == "Guest":
            tasks = Task.objects.all()
        else:
            tasks = Task.objects.filter(assignedName__icontains=user)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class SummaryView(mixins.ListModelMixin,generics.GenericAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)