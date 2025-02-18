from rest_framework import viewsets
from join_db.models import User



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer