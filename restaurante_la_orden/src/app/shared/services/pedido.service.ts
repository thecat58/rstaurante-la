import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PedidoModel } from '@shared/models/pedido.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private http = inject(HttpClient);
  private url = `api`;
  private apiUrl = `api/pedidoU`;
  private apiUrlA = `api/pedido`;

  // Obtener todas las pedidos
  getpedidos(): Observable<PedidoModel[]> {
    return this.http.get<PedidoModel[]>(`${this.url}/pedido/`);
  }

  // Crear una nueva pedido
  createPedido(datos: PedidoModel): Observable<PedidoModel> {
    const payload = {
      fecha_hora: datos.fecha_hora,
      estado: datos.estado,
      mesa: datos.mesa,
      platos: datos.platos.map((p: any) => ({
        plato_id: p.plato?.id_plato ?? p.plato_id ?? p.plato, // ✔️ extrae id correcto según venga
        cantidad: p.cantidad
      }))
    };
    return this.http.post<PedidoModel>(`${this.apiUrlA}/`, payload);
  }
  
  // Editar una pedido existente
  updatePedido(id: number, datos: PedidoModel): Observable<PedidoModel> {
    const payload = {
      id_pedido: id,
      fecha_hora: datos.fecha_hora,
      estado: datos.estado,
      mesa: datos.mesa,
      platos: datos.platos.map((p: any) => ({
        plato_id: p.plato?.id_plato ?? p.plato_id ?? p.plato, // ✔️ extrae id correcto según venga
        cantidad: p.cantidad
      }))
    };
    return this.http.put<PedidoModel>(`${this.apiUrl}/${id}/`, payload);
  }
  
  
  
}
