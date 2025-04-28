from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models import Pedido, Plato, PedidoPlato, Mesa
from app.serializers import PedidoSerializer

class PedidoView(APIView):
    """
    API para manejar operaciones relacionadas con Pedidos.
    """

    def post(self, request):
        """
        Crear un pedido y asignar platos al mismo.
        """
        data = request.data
        try:
            # Obtener la mesa asociada al pedido
            mesa = Mesa.objects.get(id_mesa=data['mesa_id'])

            # Crear el pedido
            pedido = Pedido.objects.create(
                fecha_hora=data['fecha_hora'],
                estado=data['estado'],
                mesa_id_mesa=mesa
            )

            # Agregar platos al pedido
            platos = data.get('platos', [])
            for plato_data in platos:
                plato = Plato.objects.get(id_plato=plato_data['id_plato'])
                PedidoPlato.objects.create(
                    pedido=pedido,
                    plato=plato,
                    cantidad=plato_data['cantidad']
                )

            # Serializar y devolver el pedido creado
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Mesa.DoesNotExist:
            return Response({'error': 'Mesa no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Plato.DoesNotExist:
            return Response({'error': 'Plato no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pedido_id):
        """
        Obtener los detalles de un pedido específico.
        """
        try:
            pedido = Pedido.objects.get(id_pedido=pedido_id)
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Pedido.DoesNotExist:
            return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)

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