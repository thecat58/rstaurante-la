import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginDto } from '@shared/dto/auth/login.dto';
import { RefreshDto } from '@shared/dto/auth/refresh.dto';
import { RegisterDto } from '@shared/dto/auth/register.dto';
import { TokenModel } from '@shared/models/token.model';
import { PersonaModel } from '@shared/models/persona.model';
import { TokenService } from './token.service';
import { map, switchMap, tap } from 'rxjs';
import { PasswordConfirmDto, RequestPassChangeDto } from '@shared/dto/auth/change-password';
import { MessageInfoModel } from '@shared/models/message-info.model';

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

}
