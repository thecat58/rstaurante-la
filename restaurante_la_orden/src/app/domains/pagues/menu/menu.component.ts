import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuModel } from '@shared/models/pato.model';
import { MenuService } from '@shared/services/menu.service';
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

  constructor(private platoService: MenuService) {}

  ngOnInit() {
    this.platoService.getplatos().subscribe((data: MenuModel[]) => {
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
    console.log('Orden enviada', this.carrito);
    // Aquí podrías redirigir o enviar el carrito al backend
  }
}
