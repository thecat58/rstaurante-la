import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MenuModel } from '@shared/models/pato.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private http = inject(HttpClient);

  private url = `api`;

  // Obtener todos los platos de un menú
  getPlatos(): Observable<MenuModel[]> {
    return this.http.get<MenuModel[]>(`${this.url}/menu/`);
  }

  // Crear un nuevo plato en un menú
  createPlato(menuId: number, data: Partial<MenuModel>, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', data.nombre || '');
    formData.append('descripcion', data.descripcion || '');
    formData.append('precio', String(data.precio));
    formData.append('menu_id', String(menuId));
  
    if (file) {
      formData.append('foto', file);
    }
  
    return this.http.post(`${this.url}/plato/`, formData);
  }
  

  // Editar un plato existente en un menú
  updatePlato(menuId: number, platoId: number, data: Partial<MenuModel>): Observable<MenuModel> {
    return this.http.put<MenuModel>(`${this.url}/menu/${menuId}/plato/${platoId}/`, data);
  }

  // Eliminar un plato de un menú
  deletePlato(menuId: number, platoId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/menu/${menuId}/plato/${platoId}/`);
  }
}
