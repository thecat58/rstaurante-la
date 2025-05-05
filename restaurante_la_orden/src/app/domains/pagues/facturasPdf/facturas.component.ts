import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent {
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


    // Total en pesos colombianos
    const total = pedido.cantidad * pedido.plato.precio;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL A PAGAR (COP):', 140, 90);
    doc.setFontSize(14);
    doc.text(`$${total.toFixed(2)}`, 180, 100);

    doc.output('dataurlnewwindow');
  }
}
