from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models import Pedido, PedidoPlato, Plato, Mesa
from app.serializers import PedidoSerializer
from django.shortcuts import get_object_or_404

class PedidoView(APIView):
    """
    API para manejar operaciones relacionadas con Pedidos.    """

    def post(self, request):
        """
        Crea un nuevo pedido.
        """
        serializer = PedidoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pedido_id=None):
        """
        Obtiene uno o varios pedidos.
        """
        if pedido_id:
            pedido = get_object_or_404(Pedido, pk=pedido_id)
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data)
        else:
            pedidos = Pedido.objects.all()
            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data)

    def put(self, request, pedido_id):
            """
            Actualiza un pedido existente, incluyendo sus platos.
            """
            pedido = get_object_or_404(Pedido, pk=pedido_id)
            serializer = PedidoSerializer(pedido, data=request.data)
            if serializer.is_valid():
                # Actualiza los campos del pedido
                serializer.save()

                # Actualiza los platos: borra los anteriores y agrega los nuevos
                PedidoPlato.objects.filter(pedido=pedido).delete()
                platos_data = request.data.get("platos", [])
                for plato_data in platos_data:
                    PedidoPlato.objects.create(
                        pedido=pedido,
                        plato_id=plato_data["plato"],
                        cantidad=plato_data["cantidad"]
                    )
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
