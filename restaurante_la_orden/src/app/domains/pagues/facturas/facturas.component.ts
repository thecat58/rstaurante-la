import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent {
  generarPDF() {
    const doc = new jsPDF();

    // Agregar logo
    // const img = new Image();
    // img.src = 'assets/logo.png'; // Ruta de la imagen del logo
    // doc.addImage(img, 'PNG', 10, 10, 50, 20);

    // Título de la factura
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', 160, 20);

    // Fecha
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const fecha = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 160, 30);

    // Tabla de contenido
    autoTable(doc, {
      startY: 50,
      head: [['DESCRIPCIÓN', 'CANTIDAD', 'PRECIO (€)', 'IMPORTE (€)']],
      body: [
        ['Limpieza de la casa', '2 horas', '500.00', '1,000.00'],
        ['Limpieza de muebles', '1 hora', '200.00', '200.00'],
        ['Removedor de manchas', '1 hora', '150.00', '150.00']
      ],
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        halign: 'center'
      },
      headStyles: {
        fillColor: [211, 211, 211], // Color de fondo de la cabecera
        textColor: [0, 0, 0], // Color del texto de la cabecera
        fontStyle: 'bold'
      }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY; // Cast explícito para acceder a lastAutoTable
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL A PAGAR (EUR):', 140, finalY + 10);
    doc.setFontSize(14);
    doc.text('€1,350.00', 180, finalY + 20);

    // Visualizar el PDF en una nueva pestaña
    doc.output('dataurlnewwindow');
  }
}
