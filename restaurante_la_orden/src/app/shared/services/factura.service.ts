// src/app/shared/services/factura.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Factura } from '@shared/models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'http://localhost:8000/api/facturas/'; // Ajusta esta URL según tu backend

  constructor(private http: HttpClient) {}

  // Obtener todas las facturas
  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  // Eliminar factura por ID
  deleteFactura(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  // Generar PDF
  // Generar PDF
  generarPDF(pedido: any): void {
    const doc = new jsPDF();
  
    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', 160, 20);
  
    // Fecha
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const fecha = new Date(pedido.fecha_hora).toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 160, 30);

    // Información del pedido
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');

    // Tabla con detalles
    autoTable(doc, {
      startY: 40,
      head: [['DESCRIPCIÓN', 'CANTIDAD', 'PRECIO (COP)', 'IMPORTE (COP)']],
      body: pedido.detalles.map((detalle: any) => [
        detalle.descripcion,
        detalle.cantidad,
        `$${detalle.precio.toFixed(2)}`,  // Muestra el precio en COP
        `$${(detalle.cantidad * detalle.precio).toFixed(2)}`  // Muestra el importe en COP
      ]),
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 10, halign: 'center' },
      headStyles: { fillColor: [211, 211, 211], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    // Total en pesos colombianos
    const finalY = (doc as any).lastAutoTable.finalY;
    const total = pedido.detalles.reduce((acc: number, d: any) => acc + (d.cantidad * d.precio), 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL A PAGAR (COP):', 140, finalY + 10);
    doc.setFontSize(14);
    doc.text(`$${total.toFixed(2)}`, 180, finalY + 20);
  
    doc.output('dataurlnewwindow');
  }
}
