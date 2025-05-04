from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from app.models import Factura
from app.serializers import FacturaSerializer


class FacturaClass(APIView):
    def get(self, request, factura_id=None):
        """
        Obtener todas las facturas o una factura específica.
        """
        try:
            if factura_id:
                factura = Factura.objects.get(id=factura_id)
                serializer = FacturaSerializer(factura)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                facturas = Factura.objects.all()
                serializer = FacturaSerializer(facturas, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Factura.DoesNotExist:
            return Response({'error': 'Factura no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Crear una nueva factura.
        """
        try:
            serializer = FacturaSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Error al crear la factura: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, factura_id=None):
        """
        Actualizar una factura existente.
        """
        if not factura_id:
            return Response({'error': 'El ID de la factura es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            factura = Factura.objects.get(id=factura_id)
            serializer = FacturaSerializer(factura, data=request.data, partial=True)  # `partial=True` permite actualizaciones parciales
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Factura.DoesNotExist:
            return Response({'error': 'Factura no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Error al actualizar la factura: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """
        Eliminar una factura por ID.
        """
        factura_id = kwargs.get('factura_id')
        if not factura_id:
            return Response({'error': 'El ID de la factura es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        factura = get_object_or_404(Factura, id=factura_id)
        factura.delete()
        return Response({'message': 'Factura eliminada correctamente'}, status=status.HTTP_200_OK)
