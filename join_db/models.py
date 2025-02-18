from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class User(models.Model):
    email = models.CharField(max_length=40)
    name = models.CharField(max_length=30)
    password = models.CharField(max_length=30, password=True)


class Contact(models.Model):
    color = models.CharField(max_length=7)
    email = models.EmailField(max_length=50)
    name = models.CharField(max_length=30)
    phone = PhoneNumberField()
    pass


class Task(models.Model):
    category = models.CharField(max_length=20)
    description = models.CharField(max_length=55)
    prio = models.SlugField(max_length=55)
    section = models.CharField(max_length=55)
    title = models.CharField(max_length=55)
    subtasks = models.JSONField(default=[])