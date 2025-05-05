import { CommonModule } from '@angular/common';
import { Component, inject, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment.development';
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
  menu_id: number = 1;
  mostrarModal = false;
  selectedFile: File | null = null;
  backendUrl = environment.url; // URL del backend, por ejemplo: 'http://127.0.0.1:8000'

  nuevoPlato: Partial<MenuModel> = {
    nombre: '',
    descripcion: '',
    precio: 0
  };

  constructor(
    private menuService: MenuService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarMenuConPlatos();
  }

  cargarMenuConPlatos() {
    this.menuService.getPlatos().subscribe((menus: any[]) => {
      const menu = menus.find(m => m.id === this.menu_id);
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
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  crearPlato() {
    if (!this.selectedFile) {
      console.error('Debes seleccionar una imagen.');
      return;
    }

    this.menuService.createPlato(this.menu_id, this.nuevoPlato, this.selectedFile).subscribe(() => {
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

  // Esta función construye una URL segura para mostrar la imagen desde el backend
  getSafeUrl(foto: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.backendUrl + foto);
  }
  
  
}