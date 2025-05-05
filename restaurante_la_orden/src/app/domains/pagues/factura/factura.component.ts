import { Component, OnInit } from '@angular/core';
import { FacturaService } from '@shared/services/factura.service';
import { Factura } from '@shared/models/factura.model';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  facturas: Factura[] = [];
  errorMessage: string | null = null;

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.loadFacturas();
  }

  // Cargar todas las facturas
  loadFacturas(): void {
    this.facturaService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las facturas.';
        console.error(error);
      }
    });
  }

  // Eliminar una factura
  deleteFactura(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      this.facturaService.deleteFactura(id).subscribe({
        next: () => {
          this.facturas = this.facturas.filter(factura => factura.id !== id);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar la factura.';
          console.error(error);
        }
      });
    }
  }
}