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

    def put(self, request, *args, **kwargs):
        """
        Actualizar una mesa específica.
        """
        mesa_id = kwargs.get('mesa_id')  # Obtener mesa_id desde kwargs
        if not mesa_id:
            return Response({'error': 'Id de la mesa no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            mesa = Mesa.objects.get(id_mesa=mesa_id)

            # Validar numero_mesa
            numero_mesa = request.data.get('numero_mesa')
            if numero_mesa and not str(numero_mesa).isdigit():
                return Response({'error': 'El número de mesa debe ser un número válido'}, status=status.HTTP_400_BAD_REQUEST)

            mesa.numero_mesa = numero_mesa if numero_mesa else mesa.numero_mesa
            mesa.qr_code = request.data.get('qr_code', mesa.qr_code)
            mesa.colorQr = request.data.get('colorQr', mesa.colorQr)
            mesa.descripcion = request.data.get('descripcion', mesa.descripcion)
            mesa.save()

            serializer = MesaSerializer(mesa)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Mesa.DoesNotExist:
            return Response({'error': 'Mesa no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

    def delete(self, request, *args, **kwargs):
        """
        Eliminar una mesa específica.
        """
        mesa_id = kwargs.get('mesa_id')  # Obtener mesa_id desde kwargs
        if not mesa_id:
            return Response({'error': 'El ID de la mesa es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            mesa = Mesa.objects.get(id_mesa=mesa_id)
            mesa.delete()
            return Response({'message': 'Mesa eliminada correctamente'}, status=status.HTTP_200_OK)
        except Mesa.DoesNotExist:
            return Response({'error': 'Mesa no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)