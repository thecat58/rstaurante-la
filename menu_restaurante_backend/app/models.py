from django.db import models
from .modeloP import *
from django.db import models


class Detallefactura(models.Model):
    factura = models.ForeignKey('Factura', models.DO_NOTHING, blank=True, null=True)
    plato = models.ForeignKey('Plato', models.DO_NOTHING, blank=True, null=True)
    cantidad = models.IntegerField(blank=True, null=True)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detallefactura'


class Factura(models.Model):
    fecha = models.DateField()
    total_pago = models.DecimalField(max_digits=10, decimal_places=2)
    pedido = models.ForeignKey('Pedido', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factura'


class DetalleFactura(models.Model):
    id_detalle_factura = models.AutoField(primary_key=True)
    cantidad = models.IntegerField()    
    id_factura= models.ForeignKey(Factura, models.DO_NOTHING, db_column='id_factura')
    class Meta:
        managed = True
        db_table = 'detalle_factura'

class Mesa(models.Model):
    id_mesa = models.AutoField(primary_key=True)
    numero_mesa = models.IntegerField(unique=True)
    qr_code = models.CharField(max_length=255)
    colorQr = models.CharField(max_length=255, default="#000000")  # Color negro predeterminado
    descripcion = models.CharField(max_length=255)  # Color negro predeterminado

    class Meta:
        managed = True
        db_table = 'mesa'


class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    fecha_hora = models.DateTimeField()
    estado = models.CharField(max_length=50)
    mesa_id_mesa = models.ForeignKey(Mesa, models.DO_NOTHING, db_column='mesa_id_mesa')

    class Meta:
        managed = True
        db_table = 'pedido'


class Menu(models.Model):
    tipo_menu = models.CharField(max_length=255)
    restaurante_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'menu'


class Mesa(models.Model):
    qr = models.CharField(max_length=255)
    restaurante_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mesa'


class Pedido(models.Model):
    cliente_id = models.IntegerField(blank=True, null=True)
    mesa = models.ForeignKey(Mesa, models.DO_NOTHING, blank=True, null=True)
    estado = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'pedido'

class TipoPlato(models.Model):
    id_platoTipo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    plato_id = models.ForeignKey(Plato, models.DO_NOTHING, db_column='id_plato')  # Relación con Menu

    class Meta:
        managed = True
        db_table = 'tipoplato'

class PedidoPlato(models.Model):
    pedido = models.ForeignKey(Pedido, models.DO_NOTHING, blank=True, null=True)
    plato = models.ForeignKey('Plato', models.DO_NOTHING, blank=True, null=True)
    cantidad = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pedidoplato'
        unique_together = ('pedido', 'plato')  # Evitar duplicados de la misma combinación


class Plato(models.Model):
    nombre = models.CharField(max_length=255)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_plato = models.ForeignKey('Tipoplato', models.DO_NOTHING, blank=True, null=True)
    menu = models.ForeignKey(Menu, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'plato'


class Tipoplato(models.Model):
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'tipoplato'
