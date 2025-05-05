export interface Factura {
    id?: number; // opcional al crear
    fecha: string; // formato: 'YYYY-MM-DD'
    total_pago: number;
    pedido: number | null; // o puedes definir otro tipo si quieres incluir datos del pedido
  }
  