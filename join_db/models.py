from sqlite3 import Date
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class User(models.Model):
    email = models.CharField(max_length=40)
    name = models.CharField(max_length=30)
    password = models.CharField(max_length=30)


class Contact(models.Model):
    color = models.CharField(max_length=7)
    email = models.EmailField(max_length=50)
    name = models.CharField(max_length=30)
    phone = PhoneNumberField()


class Task(models.Model):
    category = models.CharField(max_length=20)
    description = models.CharField(max_length=55)
    prio = models.CharField(max_length=255)
    section = models.CharField(max_length=55)
    title = models.CharField(max_length=55)
    subtasks = models.JSONField(default=list)
    subtasksCheck = models.JSONField(default=list)
    date = models.DateField(default=Date.today)
    prioName = models.CharField(max_length=55, default="Medium")
    assignedInitals = models.JSONField(default=list)
    assignedName = models.JSONField(default=list)
    color = models.JSONField(default=list)

    def __str__(self):
        return f"{self.title} ({self.prioName})"