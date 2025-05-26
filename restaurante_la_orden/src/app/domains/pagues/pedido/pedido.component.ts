import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PedidoModel } from '@shared/models/pedido.model';
import { PedidoService } from '@shared/services/pedido.service';
import { FacturaService } from '@shared/services/factura.service';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NzQRCodeModule],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  showModal = false;
  pedidos: PedidoModel[] = [];
  pedidosFiltrados: PedidoModel[] = [];
  mesas: number[] = [];
  filtroMesa: string = '';
  filtroFecha: string = '';
  selectedMesa: string = '';
  selectedFecha: string = '';
  search: string = '';
  modalMode: 'edit' = 'edit';
  mesaForm: FormGroup;


  cambiosPendientes: { [id: number]: boolean } = {};

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private pedidoService = inject(PedidoService);
  private facturaService = inject(FacturaService);

  ngOnInit() {
    this.cargarPedidos();
  }
  constructor() {
    this.mesaForm = this.fb.group({
      numero: ['', Validators.required],
      descripcion: ['', Validators.required],
      color: ['#000000', Validators.required],
    });
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
      ...pedido,
      estado: pedido.estado,
      fecha_hora: pedido.fecha_hora || new Date().toISOString()
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

  generarPDF(pedido: PedidoModel) {
    // Validar que el pedido tenga platos
    if (!pedido.platos || !Array.isArray(pedido.platos)) {
      console.error('El pedido no tiene platos válidos:', pedido);
      alert('No se puede generar el PDF porque los datos del pedido están incompletos.');
      return;
    }

    // Convertir los platos a un formato adecuado para el PDF
    const detalles = pedido.platos.map(plato => ({
      descripcion: `Plato ID: ${plato.plato}`,
      cantidad: plato.cantidad,
      precio: 0 // Puedes agregar lógica para obtener el precio si está disponible
    }));
    console.log('Detalles para el PDF:', detalles);
    console.log('Pedido para el PDF:', pedido);



    // Llamar al servicio para generar el PDF
    this.facturaService.generarPDF({ ...pedido, detalles });
  }


  openModal(pedido?: PedidoModel) {
    this.showModal = true;


  }
  closeModal() {
    this.showModal = false;

  }

  actualizarPedos() {

  }
}
