export interface Factura {
  id?: number; // ID opcional al crear
  fecha: string; // formato: 'YYYY-MM-DD' o ISO
  total_pago: number;
  pedido: number | null; // ID del pedido, puede ser null si aún no está asignado
}
