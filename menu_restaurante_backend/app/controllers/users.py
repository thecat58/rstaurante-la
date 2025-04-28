from rest_framework.decorators import api_view
from rest_framework import status
from app.modeloP import User
from app.serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.modeloP import User
from app.serializers import UserSerializer


class UsersPerView(APIView):
    def get(self, request):
        # Listar todos los usuarios
        users = User.objects.all()
        if users:
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No hay usuarios disponibles'}, status=status.HTTP_200_OK)

    


    def post(self, request):
        # Crear un nuevo usuario
        data = request.data
        try:
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                email=data.get('email', '')
            )
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        # Actualizar un usuario existente
        user_id = request.data.get('id')
        if not user_id:
            return Response({'error': 'ID de usuario no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=user_id)
            user.username = request.data.get('username', user.username)
            user.email = request.data.get('email', user.email)
            if 'password' in request.data:
                user.set_password(request.data['password'])
            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

