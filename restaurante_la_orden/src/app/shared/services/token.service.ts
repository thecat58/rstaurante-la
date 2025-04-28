import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenModel } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private router = inject(Router);

  session_time = signal<number>(
    parseInt(localStorage.getItem('token_exp') ?? '0')
  );
  sesion_date = signal<Date>(new Date());

  setToken(token: { access: string; refresh: string }) {
    localStorage.setItem('token', `Bearer ${token.access}`);
    localStorage.setItem('refresh', token.refresh);

    // Opcional: Si necesitas manejar la expiración del token, ajusta aquí
    const now = new Date();
    const expDate = new Date(now.getTime() + 3600 * 1000); // Suponiendo 1 hora de expiración
    localStorage.setItem('token_exp', expDate.toISOString());
    this.session_time.set(3600); // Suponiendo 1 hora en segundos
    this.sessionExpire();
  }

  sessionExpire() {
    let exp = new Date(localStorage.getItem('token_exp') as string);

    if (exp) {
      let session_time = setInterval(() => {
        let now = new Date();
        let time = Math.ceil((exp.getTime() - now.getTime()) / 1000);
        this.session_time.update(() => (time >= 0 ? time : 0));
        if (time <= 0 || !this.getToken()) {
          clearInterval(session_time);
          this.deleteToken();
          this.router.navigate(['/auth','inicio-sesion']);
          return;
        }
      }, 1000);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefresh(): string | null {
    return localStorage.getItem('refresh');
  }

  deleteToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('token_exp');
    this.router.navigate(['/auth','inicio-sesion']);
  }
}
