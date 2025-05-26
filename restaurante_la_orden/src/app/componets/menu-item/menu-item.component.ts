import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { HasChildrenPipe } from '@shared/pipes/has-children.pipe';
import { NzMenuModule } from 'ng-zorro-antd/menu';
// import { heroAcademicCapSolid, heroHomeModernSolid, heroMapSolid, heroUserGroupSolid } from '@ng-icons/heroicons/solid';
// import { lucideChartColumn, lucideCheckCheck, lucideGlobe, lucideGoal, lucideSchool, lucideTable2 } from '@ng-icons/lucide';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '@shared/services/auth.service';

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
    CanUseActionsDirective
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',

})
export class MenuItemComponent implements OnInit{
  @Input({required:true}) route:Route = {};
  @Input() path:string[] = [];
  @Input() collapsed = false;

  private authService = inject(AuthService);

  // Variables para roles
  isAdmin = false;
  isMesero = false;

  ngOnInit(): void {
    // Suponiendo que authService.roles() devuelve un array de strings con los roles del usuario
    const roles = this.authService.roles();
    this.isAdmin = roles.includes('Administrador');
    this.isMesero = roles.includes('Mesero');

    let {path} = this.route;
    if(path && !this.path.some((p)=>p === path)){ 
      this.path = [...this.path,path!];
    }
  }
  
  get path_roles():string[]{
    let {data} = this.route;
    if(!data) return [];
    let {roles} = data;
    if(!roles) return [];
    return roles;
  }
}
