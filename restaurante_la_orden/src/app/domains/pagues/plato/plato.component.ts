import { CommonModule } from '@angular/common';
import { Component, inject, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuModel } from '@shared/models/pato.model';
import { MenuService } from '@shared/services/menu.service';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-plato',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzQRCodeModule,],
  templateUrl: './plato.component.html',
  styleUrl: './plato.component.css'
})
export class PlatoComponent {
  platos: MenuModel[] = [];
  menuId: number = 1;
  mostrarModal = false;

  nuevoPlato: Partial<MenuModel> = {
    nombre: '',
    descripcion: '',
    precio: 0
  };

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.cargarMenuConPlatos();
  }

  cargarMenuConPlatos() {
    this.menuService.getPlatos().subscribe((menus: any[]) => {
      const menu = menus.find(m => m.id === this.menuId);
      if (menu) {
        this.platos = menu.platos.map((p: MenuModel) => ({
          ...p,
          cantidad: 0
        }));
      }
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoPlato = { nombre: '', descripcion: '', precio: 0 };
  }

  crearPlato() {
    this.menuService.createPlato(this.menuId, this.nuevoPlato as MenuModel).subscribe(() => {
      this.cargarMenuConPlatos();
      this.cerrarModal();
    });
  }

  incrementar(plato: MenuModel) {
    plato.cantidad = (plato.cantidad || 0) + 1;
  }

  decrementar(plato: MenuModel) {
    if (plato.cantidad && plato.cantidad > 0) {
      plato.cantidad--;
    }
  }

  agregarOrden(plato: MenuModel) {
    console.log('Agregar a orden:', plato);
  }

  guardarCambios() {
    console.log('Cambios guardados.');
  }

}