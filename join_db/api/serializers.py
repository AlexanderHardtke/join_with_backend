from rest_framework import serializers
from join_db.models import UserProfile, Contact, Task
from django.contrib.auth.models import User
import random


class CheckUserListSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = Contact
         fields = ['email']


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
        random_color = random.choice(colors)

        Contact.objects.create(
            user_profile=user_profile,
            email=account.email,
            name=f"{account.first_name} {account.last_name}".strip(),
            color=random_color
        )

        initials = f"{account.first_name[0]}{account.last_name[0]}".upper()

        tasks = Task.objects.all()
        for task in tasks:
            task.color.append(random_color)
            task.assignedInitals.append(initials)
            task.assignedName.append(f"{account.first_name} {account.last_name}".strip())
            task.save()

        return account


class ContactSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = Contact
         fields = '__all__'

    def update(self, instance, validated_data):
        tasks = Task.objects.all()
        for task in tasks:
            if instance.name in task.assignedName:
                i = task.assignedName.index(instance.name)
                full_name = validated_data.get('name', instance.name)
                initials = "".join(word[0] for word in full_name.split()).upper()
                task.color[i] = validated_data.get('color', instance.color)
                task.assignedInitals[i] = initials
                task.assignedName[i] = validated_data.get('name', instance.name)
                task.save()

        instance.color = validated_data.get('color', instance.color)
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()

        return instance
    
    def delete(self, *args, **kwargs):
        tasks = Task.objects.all()
        for task in tasks:
            if self.name in task.assignedName:
                i = task.assignedName.index(self.name)
                del task.assignedName[i]
                del task.assignedInitals[i]
                del task.color[i]
                task.save()

        super().delete(*args, **kwargs)

class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = Task
         fields = '__all__'