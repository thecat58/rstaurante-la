import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RolesModel } from '@shared/dto/auth/roles.dto';
import { UsuarioModel } from '@shared/dto/auth/user.dto';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-auth-user',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './auth-user.component.html',
  styleUrl: './auth-user.component.css'
})
export class AuthUserComponent {
  usuarios: UsuarioModel[] = [];
  permisos: RolesModel[] = [];
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  usuarioForm: FormGroup;
  selectedMesaId: number | null = null;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authservice = inject(AuthService);

  constructor() {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role_id: ['', Validators.required]
    });
  }

  ngOnInit() {

    this.authservice.getuser().subscribe((usuario) => {
      this.usuarios = [...usuario];
    });


  }

  openModal(user?: UsuarioModel) {
    this.showModal = true;
    this.authservice.getRoles().subscribe((roles) => {
      this.permisos = [...roles];
    });

    if (user) {
      this.modalMode = 'edit';
      this.selectedMesaId = user.id ?? null;
      this.usuarioForm.setValue({
        username: user.username,
        email: user.email,
        password: '', // Deja vacío para no mostrar la contraseña
        role_id: (user.user_roles && user.user_roles.length > 0)
          ? user.user_roles[0].role.id
          : '' // Si no hay roles, deja vacío
      });
    } else {
      this.modalMode = 'create';
      this.selectedMesaId = null;
      this.usuarioForm.reset();
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedMesaId = null;
  }

  agregarUser() {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;
      const nuevoUser: UsuarioModel = {
        username: formValue.username,
        email: formValue.email,
        role_id: formValue.role_id,
        password: formValue.password,
      };

      this.authservice.createUser(nuevoUser).subscribe((mesa) => {
        this.usuarios.push(mesa);
        this.closeModal();
      });
    }
  }

  actualizarMesa() {
    console.log("aklsmcklds");

    if (this.usuarioForm.valid && this.selectedMesaId !== null) {
      console.log("aklsmcklds2");
      const formValue = this.usuarioForm.value;

      const datosActualizados: Partial<UsuarioModel> = {
        username: formValue.username,
        email: formValue.email,
        user_roles: formValue.user_roles,
      };

      this.authservice.updateUser(this.selectedMesaId, datosActualizados).subscribe((mesaActualizada) => {
        const index = this.usuarios.findIndex(m => m.id === this.selectedMesaId);
        if (index > -1) {
          this.usuarios[index] = { ...this.usuarios[index], ...mesaActualizada };
        }
        this.closeModal();
      });
    }
  }







}
