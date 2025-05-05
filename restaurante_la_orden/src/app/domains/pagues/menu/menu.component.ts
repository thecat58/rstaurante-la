import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuModel } from '@shared/models/pato.model';
import { PedidoModel } from '@shared/models/pedido.model';
import { MenuService } from '@shared/services/menu.service';
import { PedidoService } from '@shared/services/pedido.service';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
// Tu modelo importado correctamente

@Component({
  selector: 'app-menu',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzQRCodeModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  platos: MenuModel[] = [];
  carrito: MenuModel[] = [];
  total = 0;
  items = 0;

  constructor(private platoService: MenuService) { }
  private pedidoService = inject(PedidoService);


  ngOnInit() {
    this.platoService.getPlatos().subscribe((data: MenuModel[]) => {
      // Al recibir los platos del servicio, les inicializamos 'cantidad' en 1
      this.platos = data.map(plato => ({ ...plato, cantidad: 1 }));
    });
  }

  agregarAlCarrito(plato: MenuModel) {
    const existe = this.carrito.find(item => item.id_plato === plato.id_plato);
    if (existe) {
      existe.cantidad! += plato.cantidad ?? 1;
    } else {
      this.carrito.push({ ...plato });
    }
    this.actualizarResumen();
    plato.cantidad = 1; // Opcional: reiniciar cantidad después de agregar
  }

  actualizarResumen() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * (item.cantidad ?? 0)), 0);
    this.items = this.carrito.reduce((acc, item) => acc + (item.cantidad ?? 0), 0);
  }

  incrementar(plato: MenuModel) {
    plato.cantidad = (plato.cantidad ?? 0) + 1;
  }

  decrementar(plato: MenuModel) {
    if ((plato.cantidad ?? 0) > 1) {
      plato.cantidad!--;
    }
  }

  cancelarOrden() {
    this.carrito = [];
    this.total = 0;
    this.items = 0;
  }

  continuarOrden() {
    if (this.carrito.length > 0) {
      const nuevoPedido: PedidoModel = {
        fecha_hora: new Date().toISOString(), // Fecha y hora actual en formato ISO
        estado: 'En preparación', // Estado fijo
        mesa: 1, // Mesa fija
        platos: this.carrito.map(plato => ({
          plato: plato.id_plato,
          cantidad: plato.cantidad ?? 1
        })) // Mapeo de los platos seleccionados
      };
  
      this.pedidoService.createPedido(nuevoPedido).subscribe((pedido) => {
        alert('Pedido realizado con éxito!');
        this.cancelarOrden(); // Limpia el carrito después de enviar el pedido
      });
    } else {
      console.error('El carrito está vacío. No se puede continuar con la orden.');
    }
  }
}
