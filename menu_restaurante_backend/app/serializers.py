from rest_framework import serializers
from .models import Cliente, Cocinero, Detallepedido, Encargado, Factura, Mesa, Mesero, Pedido, Plato, Reporte

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class CocineroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cocinero
        fields = '__all__'

class DetallepedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detallepedido
        fields = '__all__'

class EncargadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encargado
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = '__all__'

class MeseroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesero
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

class PlatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plato
        fields = '__all__'

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'
