from rest_framework import serializers
from join_db.models import User

class ProductSerializer(serializers.ModelSerializer):
    
    class Meta:
         model = User
         fields = '__all__'