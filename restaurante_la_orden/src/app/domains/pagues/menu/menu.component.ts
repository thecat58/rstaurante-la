import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment.development';
import { MenuModel } from '@shared/models/pato.model';
import { PedidoModel } from '@shared/models/pedido.model';
import { MenuService } from '@shared/services/menu.service';
import { PedidoService } from '@shared/services/pedido.service';
import { log } from 'ng-zorro-antd/core/logger';
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
  backendUrl = environment.url; // URL del backend, por ejemplo: 'http://127.0.0.1:8000'

  platos: MenuModel[] = [];
  carrito: MenuModel[] = [];
  total = 0;
  items = 0;

  constructor(private platoService: MenuService,
    private sanitizer: DomSanitizer

  ) { }
  private pedidoService = inject(PedidoService);


  ngOnInit() {
    this.platoService.getPlatos().subscribe((data: any[]) => {
      // Encuentra el menú correspondiente y extrae los platos
      const menu = data.find(m => m.id === 1); // Cambia "1" por el ID del menú que necesitas
      if (menu && menu.platos) {
        this.platos = menu.platos.map((plato: any) => ({
          ...plato,
          cantidad: 1 // Inicializa la cantidad en 1
        }));
      } else {
        console.error('No se encontraron platos para el menú.');
      }
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
  getSafeUrl(foto: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.backendUrl + foto);
  }
  
}
