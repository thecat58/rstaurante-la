# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'cliente'


class Cocinero(models.Model):
    id_cocinero = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'cocinero'


class Encargado(models.Model):
    id_encargado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    factura_id_factura = models.ForeignKey('Factura', models.DO_NOTHING, db_column='factura_id_factura')

    class Meta:
        managed = False
        db_table = 'encargado'


class Factura(models.Model):
    id_factura = models.AutoField(primary_key=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_hora = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'factura'


class Mesa(models.Model):
    id_mesa = models.AutoField(primary_key=True)
    numero_mesa = models.IntegerField(unique=True)
    qr_code = models.CharField(max_length=255)
    cliente_id_cliente = models.ForeignKey(Cliente, models.DO_NOTHING, db_column='cliente_id_cliente')

    class Meta:
        managed = False
        db_table = 'mesa'


class Mesero(models.Model):
    id_mesero = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'mesero'


class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    fecha_hora = models.DateTimeField()
    estado = models.CharField(max_length=50)
    mesa_id_mesa = models.ForeignKey(Mesa, models.DO_NOTHING, db_column='mesa_id_mesa')
    mesero_id_mesero = models.ForeignKey(Mesero, models.DO_NOTHING, db_column='mesero_id_mesero')
    factura_id_factura = models.ForeignKey(Factura, models.DO_NOTHING, db_column='factura_id_factura')

    class Meta:
        managed = False
        db_table = 'pedido'


class Plato(models.Model):
    id_plato = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    pedido_id_pedido = models.ForeignKey(Pedido, models.DO_NOTHING, db_column='pedido_id_pedido')

    class Meta:
        managed = False
        db_table = 'plato'
