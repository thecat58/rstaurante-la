from rest_framework.response import Response
from app.serializers import *
from rest_framework.views import APIView
from rest_framework import status


class detallefacturaView(APIView):
    def get(self, request):
        """
        Obtener todas las mesas.
        """
        try:
            mesas = Mesa.objects.all()  # Obtén todas las instancias de Mesa
            serializer = MesaSerializer(mesas, many=True)  # Serializa el conjunto de datos
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)