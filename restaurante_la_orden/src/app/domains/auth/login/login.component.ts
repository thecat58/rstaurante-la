import { CommonModule, FormStyle } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UsuarioModel } from '@shared/dto/auth/user.dto';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ], templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: UsuarioModel[] = [];
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  // private notification_service = inject(NotificationNoteService);

  @ViewChild('submitButton') submit_button: ElementRef = {} as ElementRef;

  loading: boolean = false;
  show_password: boolean = false;
  password_type: 'text' | 'password' = 'password'
  password_icon: 'heroEyeSlash' | 'heroEye' = 'heroEyeSlash';

  form: FormGroup;

  constructor() {
    this.form = this.formBuilder.group({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onShowPassword() {
    this.show_password = !this.show_password;
    if (this.show_password) {
      this.password_type = 'text';
      this.password_icon = 'heroEye';
      return;
    }
    this.password_type = 'password';
    this.password_icon = 'heroEyeSlash';
  }
  submitForm() {
    const { value } = this.form;
    this.loading = true;

    this.authService.login(value).subscribe({
      next: (response: any) => {
        const user = response.user;
        const rolesUsuario: string[] = Array.isArray(user.user_roles)
          ? user.user_roles
            .map((userRole: any) => userRole.role?.name?.toLowerCase())
            .filter((name: string | undefined) => !!name)
          : [];

        // Guardar el primer rol encontrado (ajusta la prioridad si lo deseas)
        let rolPrincipal = '';
        if (rolesUsuario.includes('administrador')) {
          rolPrincipal = 'admin';
        } else if (rolesUsuario.includes('mesero')) {
          rolPrincipal = 'mesero';
        } else if (rolesUsuario.includes('cocinero')) {
          rolPrincipal = 'cocinero';
        }
        if (rolPrincipal) {
          localStorage.setItem('rol', rolPrincipal);
        }

        // Redirección según el rol
        if (rolPrincipal === 'admin') {
          this.router.navigate(['/pages/mesas']).then(() => {
            alert('Bienvenido Administrador');
          });
        } else if (rolPrincipal === 'mesero') {
          this.router.navigate(['/pages/gestion/pedidos']).then(() => {
            alert('Bienvenido Mesero');
          });
        } else if (rolPrincipal === 'cocinero') {
          this.router.navigate(['/pages/gestion/pedidos']).then(() => {
            alert('Bienvenido Cocinero');
          });
        } else {
          alert('No tienes permisos para acceder a ninguna sección.');
        }
        this.loading = false;
      },
      error: (err) => {
        alert('Ocurrió un error: ' + (err.error?.message || 'Credenciales incorrectas'));
        this.loading = false;
      }
    });
  }

}
