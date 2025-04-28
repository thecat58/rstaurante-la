import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mesas',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
}) 
export class MesasComponent {
  mesas: { numero: number, descripcion: string }[] = [];
  showModal = false;
  mesaForm: FormGroup;

  qrData = 'https://tu-link-o-info-aqui.com';
  qrColor = '#000000'; // color inicial QR
  colores = ['#FFFF00', '#0000FF', '#FF0000', '#FF00FF', '#008000', '#3B2F2F', '#FF5B5B'];

  private fb = inject(FormBuilder); // Usar inject para obtener FormBuilder

  constructor() {
    this.mesaForm = this.fb.group({
      numero: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  openModal() {
    this.showModal = true;
    this.mesaForm.reset();
    this.qrColor = '#000000';
  }

  closeModal() {
    this.showModal = false;
  }

  agregarMesa() {
    if (this.mesaForm.valid) {
      this.mesas.push(this.mesaForm.value);
      this.closeModal();
    }
  }

  cambiarColorQR(color: string) {
    this.qrColor = color;
  }

  descargarQR() {
    const canvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `mesa-${this.mesaForm.value.numero}.png`;
      link.click();
    }
  }
}