from rest_framework.decorators import api_view
from rest_framework import status
from app.modeloP import User, Role, UserRole
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
        # Crear un nuevo usuario y asignar un rol
        data = request.data
        try:
            # Crear el usuario
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                email=data.get('email', '')
            )

            # Asignar el rol si se proporciona
            role_id = data.get('role_id')
            if role_id:
                try:
                    role = Role.objects.get(id=role_id)
                    # Verifica que no exista ya la relación
                    UserRole.objects.create(user=user, role=role)
                except Role.DoesNotExist:
                    return Response({'error': 'El rol especificado no existe.'}, status=status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    return Response({'error': f'Error creando UserRole: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, user_id=None):
        # Actualizar un usuario existente y su rol
        if not user_id:
            return Response({'error': 'ID de usuario no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=user_id)
            user.username = request.data.get('username', user.username)
            user.email = request.data.get('email', user.email)
            if 'password' in request.data and request.data['password']:
                user.set_password(request.data['password'])
            user.save()

            # Actualizar el rol si se proporciona
            role_id = request.data.get('role_id')
            if role_id:
                from app.modeloP import Role, UserRole
                try:
                    role = Role.objects.get(id=role_id)
                    UserRole.objects.filter(user=user).delete()
                    UserRole.objects.create(user=user, role=role)
                except Role.DoesNotExist:
                    return Response({'error': 'El rol especificado no existe.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

