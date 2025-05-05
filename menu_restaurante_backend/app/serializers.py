from rest_framework import serializers
from .modeloP import *
from app.models import DetalleFactura, Factura, Menu, Mesa, Pedido, PedidoPlato, Plato

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = '__all__'

class PedidoPlatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedidoPlato
        fields = ['plato', 'cantidad']

class PedidoSerializer(serializers.ModelSerializer):
    platos = PedidoPlatoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ['id_pedido', 'fecha_hora', 'estado', 'mesa', 'platos']

    def create(self, validated_data):
        platos_data = validated_data.pop('platos')
        pedido = Pedido.objects.create(**validated_data)
        for plato_data in platos_data:
            PedidoPlato.objects.create(pedido=pedido, **plato_data)
        return pedido
    
    def update(self, instance, validated_data):
        platos_data = validated_data.pop('platos', [])

        # Actualiza los campos simples del pedido
        instance.fecha_hora = validated_data.get('fecha_hora', instance.fecha_hora)
        instance.estado = validated_data.get('estado', instance.estado)
        instance.mesa = validated_data.get('mesa', instance.mesa)
        instance.save()

        # Elimina platos antiguos y crea los nuevos
        PedidoPlato.objects.filter(pedido=instance).delete()
        for plato_data in platos_data:
            PedidoPlato.objects.create(pedido=instance, **plato_data)

        return instance


class PlatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plato
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    platos = PlatoSerializer(source='plato_set', many=True)  # Relación con los platos

    class Meta:
        model = Menu
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'roles', 'permissions']

class DetalleFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleFactura
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'