import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { HasChildrenPipe } from '@shared/pipes/has-children.pipe';
import { NzMenuModule } from 'ng-zorro-antd/menu';
// import { heroAcademicCapSolid, heroHomeModernSolid, heroMapSolid, heroUserGroupSolid } from '@ng-icons/heroicons/solid';
// import { lucideChartColumn, lucideCheckCheck, lucideGlobe, lucideGoal, lucideSchool, lucideTable2 } from '@ng-icons/lucide';
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

  ngOnInit(): void {
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
