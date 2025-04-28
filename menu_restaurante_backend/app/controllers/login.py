from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from app.serializers import UserSerializer
from rest_framework.permissions import AllowAny

class LoginView(APIView):
    """
    API para manejar el inicio de sesión.
    """
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación

    def post(self, request, *args, **kwargs):
        """
        Validar las credenciales del usuario y devolver un token JWT.
        """
        data = request.data
        username = data.get('username')
        password = data.get('password')

        # Autenticar al usuario
        user = authenticate(username=username, password=password)

        if user is not None:
            # Generar tokens JWT
            # refresh = RefreshToken.for_user(user)

            # Serializar y devolver los datos del usuario junto con los tokens
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                # 'refresh': str(refresh),
                # 'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)