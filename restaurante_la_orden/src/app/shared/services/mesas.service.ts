import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MesaModel } from '@shared/models/mesa.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  private http = inject(HttpClient);
  private url = `api`;

  // Obtener todas las mesas
  getMesas(): Observable<MesaModel[]> {
    return this.http.get<MesaModel[]>(`${this.url}/mesa/`);
  }

  // Crear una nueva mesa
  createMesa(data: MesaModel): Observable<MesaModel> {
    return this.http.post<MesaModel>(`${this.url}/mesa/`, data);
  }

  // Editar una mesa existente
  updateMesa(id: number, data: Partial<MesaModel>): Observable<MesaModel> {
    return this.http.put<MesaModel>(`${this.url}/mesa/${id}/`, data);
  }

  // Eliminar una mesa
  deleteMesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/mesa/${id}/`);
  }
}
