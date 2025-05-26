import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MesaModel } from '@shared/models/mesa.model';
import { UrlMesaPipe } from '@shared/pipes/url-mesa.pipe';
import { MesasService } from '@shared/services/mesas.service';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [
    CommonModule,
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
  modalMode: 'create' | 'edit' = 'create';
  mesaForm: FormGroup;
  colorQr = '#000000';
  url: string = '';
  selectedMesaId: number | null = null;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private mesaService = inject(MesasService);

  constructor() {
    this.mesaForm = this.fb.group({
      numero: ['', Validators.required],
      descripcion: ['', Validators.required],
      color: ['#000000', Validators.required],
    });
  }

  ngOnInit() {
    const serverIp = '192.168.1.100';

    this.mesaService.getMesas().subscribe((mesas) => {
      this.mesas = [...mesas];
    });

    this.mesaForm.valueChanges.subscribe((value) => {
      this.colorQr = value.color;
      this.url = `http://${serverIp}` + this.router.createUrlTree([`/mesa/${value.numero}/menu`]).toString();
    });
  }

openModal(mesa?: MesaModel) {
  this.showModal = true;

  if (mesa) {
    this.modalMode = 'edit';
    this.selectedMesaId = mesa.id_mesa ?? null;
    this.mesaForm.setValue({
      numero: mesa.numero_mesa,
      descripcion: mesa.descripcion,
      color: mesa.colorQr || '#000000'
    });
    this.colorQr = mesa.colorQr;
    this.url = mesa.qr_code;
  } else {
    this.modalMode = 'create';
    this.selectedMesaId = null;
    this.mesaForm.reset({ color: '#000000' });
    this.colorQr = '#000000';
    this.url = '';
  }
}

  closeModal() {
    this.showModal = false;
    this.mesaForm.reset({ color: '#000000' });
    this.selectedMesaId = null;
  }

  agregarMesa() {
    if (this.mesaForm.valid) {
      const formValue = this.mesaForm.value;
      const nuevaMesa: MesaModel = {
        descripcion: formValue.descripcion,
        numero_mesa: formValue.numero,
        qr_code: window.location.origin + this.router.createUrlTree([`/mesa/${formValue.numero}/menu`]).toString(),
        colorQr: formValue.color
      };

      this.mesaService.createMesa(nuevaMesa).subscribe((mesa) => {
        this.mesas.push(mesa);
        this.closeModal();
      });
    }
  }

  actualizarMesa() {
    
    if (this.mesaForm.valid && this.selectedMesaId !== null) {
      console.log("aklsmcklds2");
      const formValue = this.mesaForm.value;
  
      const datosActualizados: Partial<MesaModel> = {
        numero_mesa: formValue.numero,
        descripcion: formValue.descripcion,
        qr_code: window.location.origin + this.router.createUrlTree([`/mesa/${formValue.numero}/menu`]).toString(),
        colorQr: formValue.color
      };
  
      this.mesaService.updateMesa(this.selectedMesaId, datosActualizados).subscribe((mesaActualizada) => {
        const index = this.mesas.findIndex(m => m.id_mesa === this.selectedMesaId);
        if (index > -1) {
          this.mesas[index] = { ...this.mesas[index], ...mesaActualizada };
        }
        this.closeModal();
      });
      console.log("aklsmcklds3");
    }
  }
  

  eliminarMesa(id_mesa: any) {
    this.mesaService.deleteMesa(id_mesa).subscribe(() => {
      this.mesas = this.mesas.filter((mesa) => mesa.id_mesa !== id_mesa);
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

  onClickCart(id_mesa: number) {
    this.url = window.location.origin + this.router.createUrlTree([`/mesa/${id_mesa}/menu`]).toString();
  }
}
