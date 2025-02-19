from rest_framework import serializers
from join_db.models import User, Contact, Task


class UsersSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = User
         fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = Contact
         fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = Task
         fields = '__all__'