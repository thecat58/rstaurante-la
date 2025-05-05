import { CommonModule, FormStyle } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  // private notification_service = inject(NotificationNoteService);

  @ViewChild('submitButton') submit_button:ElementRef = {} as ElementRef;

  loading:boolean = false;
  show_password:boolean = false;
  password_type:'text'|'password'= 'password'
  password_icon:'heroEyeSlash'|'heroEye' = 'heroEyeSlash';

  form:FormGroup;

  constructor(){
    this.form = this.formBuilder.group({
      username: new FormControl(null,[Validators.required,Validators.email]),
      password: new FormControl(null,[Validators.required])
    });      
  }

  onShowPassword(){
    this.show_password = !this.show_password;
    if(this.show_password){
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
        next: () => { 
            console.log('Redirigiendo a /pages/mesas');
            this.router.navigate(['pages/mesas']);
            alert('Bienvenido');
        },
        error: (err) => {
            alert('Ocurrió un error: ' + (err.error?.message || 'Credenciales incorrectas'));
            this.loading = false;
        },
        complete: () => {
            this.loading = false;
        }
    });
  }

}
