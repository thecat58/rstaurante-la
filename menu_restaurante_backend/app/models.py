# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
# filepath: c:\Users\KIKE\Desktop\rstaurante-la\menu_restaurante_backend\Role, Permission, User, UserRole, RolePermission, UserPapp\models.py
from .modeloP import *



class Factura(models.Model):
    id_factura = models.AutoField(primary_key=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_hora = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'factura'


class Mesa(models.Model):
    id_mesa = models.AutoField(primary_key=True)
    numero_mesa = models.IntegerField(unique=True)
    qr_code = models.CharField(max_length=255)

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
    id_menu = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'menu'


class Plato(models.Model):
    id_plato = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    menu_id_menu = models.ForeignKey(Menu, models.DO_NOTHING, db_column='menu_id_menu')  # Relación con Menu

    class Meta:
        managed = True
        db_table = 'plato'


class PedidoPlato(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, db_column='pedido_id')
    plato = models.ForeignKey(Plato, on_delete=models.CASCADE, db_column='plato_id')
    cantidad = models.PositiveIntegerField(default=1)  # Cantidad de platos en el pedido

    class Meta:
        managed = True
        db_table = 'pedido_plato'
        unique_together = ('pedido', 'plato')  # Evitar duplicados de la misma combinación
