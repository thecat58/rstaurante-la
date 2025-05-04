from rest_framework.response import Response
from app.serializers import *
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404


class DetalleFacturClass(APIView):
    def get(self, request, detalle_id=None):
        """
        Obtener todos los detalles de factura o un detalle específico.
        """
        try:
            if detalle_id:  # Si se proporciona un ID, obtener un detalle específico
                detalle = DetalleFactura.objects.get(id_detalle_factura=detalle_id)
                serializer = DetalleFacturaSerializer(detalle)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:  # Si no se proporciona un ID, obtener todos los detalles
                detalles = DetalleFactura.objects.all()
                serializer = DetalleFacturaSerializer(detalles, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except DetalleFactura.DoesNotExist:
            return Response({'error': 'Detalle de factura no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
   
   
    def post(self, request):
        data = request.data
        try:
            serializer = DetalleFacturaSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': f'Error al crear el detalle: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, *args, **kwargs):
            """
            Eliminar un detalle de factura específico.
            """
            detalle_id = kwargs.get('detalle_id')
            if not detalle_id:
                return Response({'error': 'El ID del detalle de factura es requerido'}, status=status.HTTP_400_BAD_REQUEST)
            
            detalle = get_object_or_404(DetalleFactura, id_detalle_factura=detalle_id)
            detalle.delete()
            return Response({'message': 'Detalle de factura eliminado correctamente'}, status=status.HTTP_200_OK)