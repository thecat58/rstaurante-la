import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PedidoModel } from '@shared/models/pedido.model';
import { PedidoService } from '@shared/services/pedido.service';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NzQRCodeModule,],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent implements OnInit {
  pedidos: PedidoModel[] = [];
  pedidosFiltrados: PedidoModel[] = [];
  mesas: number[] = [];
  filtroMesa: string = '';
  filtroFecha: string = '';
  selectedMesa: string = '';
  selectedFecha: string = '';
  search: string = '';

  cambiosPendientes: { [id: number]: boolean } = {};

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private pedidoService = inject(PedidoService);

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidoService.getpedidos().subscribe((pedidos) => {
      this.pedidos = pedidos;
      this.filtrarPedidos();
    });
  }

  filtrarPedidos() {
    this.pedidosFiltrados = this.pedidos.filter(p =>
      (!this.selectedMesa || p.mesa.toString() === this.selectedMesa) &&
      (!this.selectedFecha || p.fecha_hora.startsWith(this.selectedFecha)) &&
      (!this.search || p.id_pedido?.toString().includes(this.search))
    );
  }


  cambiarEstado(pedido: PedidoModel) {
    const nuevoEstado = pedido.estado === 'Entregado' ? 'Demorado' : 'Entregado';
    pedido.estado = nuevoEstado;
    this.cambiosPendientes[pedido.id_pedido!] = true;
  }
  marcarCambio(pedido: PedidoModel) {
    if (pedido.id_pedido !== undefined) {
      this.cambiosPendientes[pedido.id_pedido] = true;
    }
  }  

  actualizarPedido(pedido: PedidoModel) {
    const datosActualizados: PedidoModel = {
      ...pedido, // Copiamos todas las propiedades del pedido
      estado: pedido.estado,
      fecha_hora: pedido.fecha_hora || new Date().toISOString() // Asignar un valor por defecto si es undefined
    };
  
    this.pedidoService.updatePedido(pedido.id_pedido!, datosActualizados).subscribe((pedidoActualizado) => {
      const index = this.pedidos.findIndex(p => p.id_pedido === pedido.id_pedido);
      if (index > -1) {
        this.pedidos[index] = { ...this.pedidos[index], ...pedidoActualizado };
      }
      delete this.cambiosPendientes[pedido.id_pedido!];
    });
  }

  verFactura(pedido: PedidoModel) {
    this.router.navigate(['/factura', pedido.id_pedido]);
  }

  tieneCambios(id: number): boolean {
    return !!this.cambiosPendientes[id];
  }
}

