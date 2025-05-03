from rest_framework.response import Response
from app.serializers import *
from rest_framework.views import APIView
from rest_framework import status


class Mesaclass(APIView):
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
    
    def post(self, request):
        data = request.data
        serializer = MesaSerializer(data=data)
        try:
            # Crear la instancia de Mesa con el color proporcionado o el valor predeterminado
            Mesas = Mesa.objects.create(
                numero_mesa=data['numero_mesa'],
                qr_code=data['qr_code'],
                colorQr=data.get('colorQr', "#000000"),  # Usar el color proporcionado o el predeterminado
                descripcion=data.get('descripcion', '')  # Usar la descripción proporcionada o una cadena vacía
            )
            serializer = MesaSerializer(Mesas)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        mesa_id = request.data.get('id')
        if not mesa_id:
            return Response({'error': 'Id de la mesa no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            mesa = Mesa.objects.get(id=mesa_id)
            mesa.numero_mesa = request.data.get('numero_mesa', mesa.numero_mesa)
            mesa.qr_code = request.data.get('qr_code', mesa.qr_code)
            mesa.colorQr = request.data.get('colorQr', mesa.colorQr)  # Actualizar el color si se proporciona
            mesa.descripcion = request.data.get('descripcion', mesa.descripcion)  # Actualizar la descripción si se proporciona
            mesa.save()
            serializer = MesaSerializer(mesa)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Mesa.DoesNotExist:
            return Response({'error': 'Mesa no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)