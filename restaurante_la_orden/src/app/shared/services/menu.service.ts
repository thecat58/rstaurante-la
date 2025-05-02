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
  // Obtener todas las platos
  getplatos(): Observable<MenuModel[]> {
    return this.http.get<MenuModel[]>(`${this.url}/plato/`);
  }

  // Crear una nueva plato
  createplato(data: MenuModel): Observable<MenuModel> {
    return this.http.post<MenuModel>(`${this.url}/plato/`, data);
  }

  // Editar una plato existente
  // updateplato(id: number, data: Partial<MenuModel>): Observable<MenuModel> {
  //   return this.http.put<MenuModel>(`${this.url}/plato/${}/`, data);
  // }

  // Eliminar una plato
  deleteplato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/plato/${id}/`);
  }}
