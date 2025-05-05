from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models import Pedido, Plato, PedidoPlato, Mesa
from app.serializers import PedidoSerializer

class PedidoView(APIView):
    """
    API para manejar operaciones relacionadas con Pedidos.    """

    def post(self, request):
        """
        Crear un nuevo pedido.
        """
        try:
            serializer = PedidoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Error al crear el pedido: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pedido_id=None):
        if pedido_id:
            try:
                pedido = Pedido.objects.get(id_pedido=pedido_id)
                serializer = PedidoSerializer(pedido)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Pedido.DoesNotExist:
                return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        else:
            pedidos = Pedido.objects.all()
            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pedido_id):
        """
        Eliminar un pedido.
        """
        try:
            pedido = Pedido.objects.get(id_pedido=pedido_id)
            pedido.delete()
            return Response({'message': 'Pedido eliminado exitosamente'}, status=status.HTTP_200_OK)
        except Pedido.DoesNotExist:
            return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pedido_id=None):
        """
        Actualizar un pedido existente.
        """
        if not pedido_id:
            return Response({'error': 'El ID del pedido es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            pedido = Pedido.objects.get(id_pedido=pedido_id)
            serializer = PedidoSerializer(pedido, data=request.data, partial=True)  # `partial=True` permite actualizaciones parciales
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Pedido.DoesNotExist:
            return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Error al actualizar el pedido: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)