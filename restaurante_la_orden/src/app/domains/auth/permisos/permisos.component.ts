import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RolesModel, PermissionModel } from '@shared/dto/auth/roles.dto';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-permisos',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent {
  roles: RolesModel[] = [];
  permisos: PermissionModel[] = [];
  permisosSeleccionados: number[] = [];
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  roleForm: FormGroup;
  selectedRoleId: number | null = null;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authservice = inject(AuthService);

  constructor() {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarRoles();
    this.cargarPermisos();
  }

  cargarRoles() {
    this.authservice.getRoles().subscribe((roles) => {
      this.roles = [...roles];
    });
  }

  cargarPermisos() {
    this.authservice.getpermisos().subscribe((permisos) => {
      this.permisos = [...permisos];
    });
  }

  openModal(role?: RolesModel) {
    this.showModal = true;
    if (role) {
      this.modalMode = 'edit';
      this.selectedRoleId = role.id ?? null;
      this.roleForm.setValue({
        name: role.name,
        description: role.description
      });
      // Cargar permisos seleccionados del rol
      if (Array.isArray(role.permissions) && role.permissions.length > 0) {
        if (typeof role.permissions[0] === 'object') {
          // Es PermissionModel[]
          this.permisosSeleccionados = (role.permissions as PermissionModel[]).map(p => p.id!);
        } else {
          // Es number[]
          this.permisosSeleccionados = role.permissions as number[];
        }
      } else {
        this.permisosSeleccionados = [];
      }
    } else {
      this.modalMode = 'create';
      this.selectedRoleId = null;
      this.roleForm.reset();
      this.permisosSeleccionados = [];
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedRoleId = null;
    this.permisosSeleccionados = [];
  }

  onPermisoChange(event: any, id: number) {
    if (event.target.checked) {
      if (!this.permisosSeleccionados.includes(id)) {
        this.permisosSeleccionados.push(id);
      }
    } else {
      this.permisosSeleccionados = this.permisosSeleccionados.filter(pid => pid !== id);
    }
  }

  todosSeleccionados(): boolean {
    return this.permisos.length > 0 && this.permisosSeleccionados.length === this.permisos.length;
  }

  toggleTodosPermisos(event: any) {
    if (event.target.checked) {
      this.permisosSeleccionados = this.permisos.map(p => p.id!);
    } else {
      this.permisosSeleccionados = [];
    }
  }

  agregarRole() {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;
      const nuevoRole = {
        name: formValue.name ?? '',
        description: formValue.description ?? '',
        permissions: this.permisosSeleccionados // <-- solo IDs
      };

      this.authservice.createRoles(nuevoRole).subscribe({
        next: (role) => {
          this.cargarRoles();
          this.closeModal();
          this.roleForm.reset();
        },
        error: (err) => {
          console.error('Error al crear el rol:', err);
        }
      });
    }
  }

  actualizarRole() {
    if (this.roleForm.valid && this.selectedRoleId !== null) {
      const formValue = this.roleForm.value;
      const datosActualizados: Partial<RolesModel> = {
        name: formValue.name,
        description: formValue.description,
        permissions: this.permisos
          .filter(p => this.permisosSeleccionados.includes(p.id!))
          .map(p => ({ id: p.id!, name: p.name, description: p.description }))
      };

      this.authservice.updateRoles(this.selectedRoleId, datosActualizados).subscribe((roleActualizado) => {
        const index = this.roles.findIndex(r => r.id === this.selectedRoleId);
        if (index > -1) {
          this.roles[index] = { ...this.roles[index], ...roleActualizado };
        }
        this.closeModal();
      });
    }
  }


}
