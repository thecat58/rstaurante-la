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

  constructor(private http: HttpClient) { }

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
    const img = new Image();
    img.src = '/logos/logo2.png'; // Ruta relativa desde `public/`

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');

      const doc = new jsPDF();

      // Agregar logo
      doc.addImage(imgData, 'PNG', 10, 10, 40, 10);

      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURA', 160, 20);

      // Fecha y detalles
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const fecha = new Date(pedido.fecha_hora).toLocaleDateString();
      doc.text(`Fecha: ${fecha}`, 20, 40);
      doc.text(`ID Pedido: ${pedido.id_pedido}`, 20, 48);
      doc.text(`Mesa: ${pedido.mesa}`, 20, 56);
      doc.text(`Estado: ${pedido.estado}`, 20, 64);

      // Tabla
      autoTable(doc, {
        startY: 75,
        head: [['PLATO', 'DESCRIPCIÓN', 'CANTIDAD', 'PRECIO (COP)', 'IMPORTE (COP)']],
        body: pedido.platos.map((detalle: any) => [
          detalle.plato.nombre,
          detalle.plato.descripcion,
          detalle.cantidad,
          `$${parseFloat(detalle.plato.precio).toFixed(2)}`,
          `$${(detalle.cantidad * parseFloat(detalle.plato.precio)).toFixed(2)}`
        ]),
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 10, halign: 'center' },
        headStyles: { fillColor: [211, 211, 211], textColor: [0, 0, 0], fontStyle: 'bold' }
      });

      // Total
      const total = pedido.platos.reduce((acc: number, item: any) => {
        return acc + item.cantidad * parseFloat(item.plato.precio);
      }, 0);

      const finalY = (doc as any).lastAutoTable.finalY;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL A PAGAR (COP):', 140, finalY + 10);
      doc.setFontSize(14);
      doc.text(`$${total.toFixed(2)}`, 180, finalY + 20);

      doc.output('dataurlnewwindow');
    };
  }


}
