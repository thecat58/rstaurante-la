export interface PedidoModel {
    id_pedido?: number;
    fecha_hora: string;
    estado: string;
    mesa: number;
    platos: {
      plato: number;  // id del plato
      cantidad: number;
    }[];
  }

export interface PlatoPedidoModel {
    plato:number;
    cantidad:number;
}




