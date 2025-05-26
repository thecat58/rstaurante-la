import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginDto } from '@shared/dto/auth/login.dto';
import { RefreshDto } from '@shared/dto/auth/refresh.dto';
import { RegisterDto } from '@shared/dto/auth/register.dto';
import { TokenModel } from '@shared/models/token.model';
import { PersonaModel } from '@shared/models/persona.model';
import { TokenService } from './token.service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { PasswordConfirmDto, RequestPassChangeDto } from '@shared/dto/auth/change-password';
import { MessageInfoModel } from '@shared/models/message-info.model';
import { UsuarioModel } from '@shared/dto/auth/user.dto';
import { PermissionModel, RolesModel } from '@shared/dto/auth/roles.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private token_service = inject(TokenService);

  private url = `api`;

  usuario = signal<PersonaModel|undefined>(undefined);
  roles = computed(()=>{
    if(this.usuario() && this.usuario()!.roles){
      let {roles} = this.usuario()!;
      let roles_usuario = roles ?? [];
      return roles_usuario.map(r=>r.rol_nombre);
    }else{
      return [];
    }
  });
  loading_user = signal<boolean>(true);
  
  getUser(credentials: LoginDto) {
    return this.http.post<{ access: string; refresh: string; user: PersonaModel }>(`${this.url}/login/`, credentials).pipe(
      tap(response => {
        // Guardar los tokens
        this.token_service.setToken({ access: response.access, refresh: response.refresh });
        this.usuario.set(response.user); // Establecer el usuario actual
        this.loading_user.set(false); // Finalizar la carga del usuario
      })
    );
  }


  login(credentials: LoginDto) {
    return this.http.post<{ access: string; refresh: string; user: PersonaModel }>(`${this.url}/login/`, credentials).pipe(
      tap(response => {
        // Guardar los tokens
        this.token_service.setToken({ access: response.access, refresh: response.refresh });
        this.usuario.set(response.user); // Establecer el usuario actual
        this.loading_user.set(false); // Finalizar la carga del usuario
      })
    );
  }

  sendRecoverEmail(credentials:RequestPassChangeDto){
    return this.http.post<MessageInfoModel>(`${this.url}/recover-password`, credentials);
  }

  passwordChange(credentials:PasswordConfirmDto){
    return this.http.post<MessageInfoModel>(`${this.url}/recover-password-confirm`, credentials);
  }

  me(){
    return this.http.get<PersonaModel>(`${this.url}/me`);
  }

  refresh(token:RefreshDto){
    return this.http.post<TokenModel>(`${this.url}/login/refresh`,token);
  }
  createUser(data: UsuarioModel): Observable<UsuarioModel>{
    return this.http.post<UsuarioModel>(`${this.url}/users/`,data);
  }
  updateUser(id: number, data: Partial<UsuarioModel>): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${this.url}/userU/${id}/`, data);
  }
  getuser(): Observable<UsuarioModel[]>{
    return this.http.get<UsuarioModel[]>(`${this.url}/users/`);
  }
  logOut(token:RefreshDto){
    return this.http.post<MessageInfoModel>(`${this.url}/logout/`,token)
      .pipe(map((message)=>{
        this.token_service.deleteToken();
        this.usuario.set(undefined);
        return message;
      }));
  }

  updateProfile(formData:RegisterDto){
    return this.http.put<MessageInfoModel>(`${this.url}/profile_update`,formData)
      .pipe(tap(()=>{
        this.me().subscribe((usuario)=>this.usuario.set(usuario));
      }));
  }

  getRoles(): Observable<RolesModel[]>{
    return this.http.get<RolesModel[]>(`${this.url}/roles/`);
  }
  getpermisos(): Observable<PermissionModel[]>{
    return this.http.get<PermissionModel[]>(`${this.url}/permisos/`);
  }
   createRoles(data: RolesModel): Observable<RolesModel>{
    return this.http.post<RolesModel>(`${this.url}/roles/`,data);
  }
  updateRoles(id: number, data: Partial<RolesModel>): Observable<RolesModel> {
    return this.http.put<RolesModel>(`${this.url}/userU/${id}/`, data);
  }
}
