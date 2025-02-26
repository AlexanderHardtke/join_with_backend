from sqlite3 import Date
from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class Contact(models.Model):
    user_profile = models.OneToOneField(
        UserProfile, on_delete=models.CASCADE,
        related_name="contact", blank=True, default=""
    )
    color = models.CharField(max_length=7)
    email = models.EmailField(max_length=50)
    name = models.CharField(max_length=30)
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone = models.CharField(
        validators=[phone_regex], max_length=17, blank=True
    )

    def __str__(self):
        return f"{self.name}"


class Task(models.Model):
    category = models.CharField(max_length=20)
    description = models.CharField(max_length=55, default="", blank=True)
    prio = models.CharField(max_length=255)
    section = models.CharField(max_length=55)
    title = models.CharField(max_length=55)
    subtasks = models.JSONField(default=list)
    subtasksCheck = models.JSONField(default=list)
    date = models.DateField(default=Date.today)
    prioName = models.CharField(max_length=55, default="Medium")
    color = models.JSONField(default=list)
    assignedInitals = models.JSONField(default=list)
    assignedName = models.JSONField(default=list)

    def __str__(self):
        return f"{self.title} ({self.prioName})"    