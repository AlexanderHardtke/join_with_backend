from rest_framework import serializers
from join_db.models import UserProfile, Contact, Task
from django.contrib.auth.models import User
import random


class UserProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = UserProfile
         fields = '__all__'


class RegistrationSerializer(serializers.ModelSerializer):
    
    repeated_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'repeated_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        pw = self.validated_data['password']
        repeated_pw = self.validated_data['repeated_password']

        if pw != repeated_pw:
            raise serializers.ValidationError({'error': 'passwords dont match'})
        
        if User.objects.filter(email=self.validated_data['email']).exists():
            raise serializers.ValidationError({'error': 'email already used'})

        account = User(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],
        )
        account.set_password(pw)
        account.save()

        user_profile = UserProfile.objects.create(user=account)

        colors = ["#41afaa", "#466eb4", "#00a0e1", "#e6a532", "#d7642c", "#af4b91"]
        Contact.objects.create(
            user_profile=user_profile,
            email=account.email,
            name=f"{account.first_name} {account.last_name}".strip(),
            color=random.choice(colors)
        )

        initials = f"{account.first_name[0]}{account.last_name[0]}".upper()

        tasks = Task.objects.all()
        for task in tasks:
            task.assignedInitals.append(initials)
            task.assignedName.append(f"{account.first_name} {account.last_name}".strip())
            task.save()

        return account


class ContactSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = Contact
         fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = Task
         fields = '__all__'