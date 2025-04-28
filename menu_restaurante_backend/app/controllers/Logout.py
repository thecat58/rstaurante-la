from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

class LogoutView(APIView):
    """
    API para manejar el cierre de sesión.
    """
    permission_classes = [IsAuthenticated]  # Requiere que el usuario esté autenticado

    def post(self, request, *args, **kwargs):
        """
        Invalidar el token de refresco del usuario.
        """
        try:
            # Obtener el token de refresco del usuario
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # Invalidar el token de refresco

            return Response({'message': 'Sesión cerrada exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No se pudo cerrar la sesión', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)