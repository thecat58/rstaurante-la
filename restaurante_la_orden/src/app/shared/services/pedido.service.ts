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

  // Obtener todas las pedidos
  getpedidos(): Observable<PedidoModel[]> {
    return this.http.get<PedidoModel[]>(`${this.url}/pedido/`);
  }

  // Crear una nueva pedido
  createPedido(data: PedidoModel): Observable<PedidoModel> {
    return this.http.post<PedidoModel>(`${this.url}/pedido/`, data);
  }

  // Editar una pedido existente
  updatePedido(id: number, datos: PedidoModel): Observable<PedidoModel> {
    return this.http.put<PedidoModel>(`${this.apiUrl}/${id}/`, {
      id_pedido: id,
      fecha_hora: datos.fecha_hora,
      estado: datos.estado,
      mesa: datos.mesa,
      platos: datos.platos  // 👈 esta línea es la clave
    });
  } 
  
}
