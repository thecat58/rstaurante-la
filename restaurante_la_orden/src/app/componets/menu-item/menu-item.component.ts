import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { HasChildrenPipe } from '@shared/pipes/has-children.pipe';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    NzMenuModule,
    HasChildrenPipe,
    RouterModule,
    NzPopoverModule,
    NzTypographyModule,
    // CanUseActionsDirective
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
})
export class MenuItemComponent implements OnInit{
  @Input({required:true}) route:Route = {};
  @Input() path:string[] = [];
  @Input() collapsed = false;

  rol: string | null = null;

  ngOnInit(): void {
    let {path} = this.route;
    if(path && !this.path.some((p)=>p === path)){ 
      this.path = [...this.path,path!];
    }
    // Obtener el rol desde localStorage
    this.rol = localStorage.getItem('rol');
    console.log('Rol en localStorage:', this.rol);
  }
  
  get path_roles():string[]{
    let {data} = this.route;
    if(!data) return [];
    let {roles} = data;
    if(!roles) return [];
    return roles;
  }

  
  canShow(): boolean {
    if (!this.route.data || !this.route.data['roles']) return true;
    const rol = this.rol;
    if (!rol) return false;
    const rolesRuta = this.route.data['roles'].map((r: string) => r.toLowerCase());
    console.log('Evaluando visibilidad:', { rol, rolesRuta });
    return rolesRuta.includes(rol.toLowerCase());
  }

  get showChildren(): boolean {
    return Array.isArray(this.route.children) && this.route.children.length > 0 && this.canShow();
  }
}
