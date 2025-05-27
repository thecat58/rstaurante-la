from rest_framework.decorators import api_view
from rest_framework import status
from app.modeloP import Permission
from app.serializers import PermissionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.serializers import PermissionSerializer


class PermisosView(APIView):
    
    def get(self, request):
        # Listar todos los usuarios
        users = Permission.objects.all()
        if users:
            serializer = PermissionSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No hay usuarios disponibles'}, status=status.HTTP_200_OK)
