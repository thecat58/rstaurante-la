import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
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
    // NgIconComponent,
    // HasChildrenPipe,
    RouterModule,
    NzPopoverModule,
    // CanUseActionsDirective,
    NzTypographyModule
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
  // viewProviders: [provideIcons({ 
  //   heroAcademicCapSolid,
  //   heroHomeModernSolid,
  //   heroMapSolid,
  //   heroChartPie,
  //   lucideSchool,
  //   simpleLevelsdotfyi,
  //   heroUserGroupSolid,
  //   heroLanguage,
  //   lucideGoal,
  //   lucideCheckCheck,
  //   lucideTable2,
  //   lucideGlobe,
  //   lucideChartColumn
  // })]
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
