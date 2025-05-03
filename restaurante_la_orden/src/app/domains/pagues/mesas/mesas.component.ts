import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MesaModel } from '@shared/models/mesa.model';
import { UrlMesaPipe } from '@shared/pipes/url-mesa.pipe';
import { MesasService } from '@shared/services/mesas.service';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-mesas',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzQRCodeModule,
    UrlMesaPipe,
  ],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  mesas: MesaModel[] = [];
  showModal = false;
  mesaForm: FormGroup;
  private router = inject(Router);
  url: any = this.router.createUrlTree(["/papatas"]); // URL para el código QR
  colorQr = '#000000'; // Color del código QR



  private fb = inject(FormBuilder); // Usar inject para obtener FormBuilder
  private mesaService = inject(MesasService); // Usar inject para obtener el servicio de mesas

  // ngOnInit() {
  //   this.mesaService.getMesas().subscribe((mesas) => {
  //     this.mesas = [...mesas]; // Asignar el resultado a la variable mesas);
  //   });
  //   this.mesaForm.valueChanges.subscribe((value) => {
  //     this.colorQr = value.color; // Cambiar el color del QR según el valor del formulario
  //     this.url = window.location.origin + this.router.createUrlTree([`/mesa/${value.numero}/menu`]).toString(); // URL para el código QR
  //   } );
  // }
  ngOnInit() {
    const serverIp = '192.168.1.100'; // Reemplaza con la IP de tu servidor
  
    this.mesaService.getMesas().subscribe((mesas) => {
      this.mesas = [...mesas]; // Asignar el resultado a la variable mesas
    });
  
    this.mesaForm.valueChanges.subscribe((value) => {
      this.colorQr = value.color; // Cambiar el color del QR según el valor del formulario
      this.url = `http://${serverIp}` + this.router.createUrlTree([`/mesa/${value.numero}/menu`]).toString(); // Construir la URL con la IP
    });
  }
  constructor() {
    this.mesaForm = this.fb.group({
      numero: ['', Validators.required],
      descripcion: ['', Validators.required],
      color: ['', Validators.required],
    });
  }
  onClickCart(id_mesa: number) {
    this.url = window.location.origin + this.router.createUrlTree([`/mesa/${id_mesa}/menu`]).toString(); // URL para el código QR
  }

  openModal() {
    this.showModal = true;
    this.mesaForm.reset();
    this.colorQr = '#000000';
  }

  closeModal() {
    this.showModal = false;
  }

  agregarMesa() {
    if (this.mesaForm.valid) {
      const formValue = this.mesaForm.value;
      const nuevaMesa: MesaModel = {
        descripcion: formValue.descripcion, // mapear numero -> numero_mesa
        numero_mesa: formValue.numero, // mapear numero -> numero_mesa
        qr_code: window.location.origin + this.router.createUrlTree([`/mesa/${formValue.numero}/menu`]).toString(), // construir la URL
        colorQr: formValue.color // tomar el color del formulario
      };
  
      this.mesaService.createMesa(nuevaMesa).subscribe((mesa) => {
        this.mesas.push(mesa); // Agregar la nueva mesa a la lista
        this.closeModal(); // Cerrar el modal
      });
    }
  }
  
  eliminarMesa(id_mesa: number) {
    this.mesaService.deleteMesa(id_mesa).subscribe(() => {
      this.mesas = this.mesas.filter((mesa) => mesa.id_mesa !== id_mesa); // Eliminar la mesa de la lista
    });
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