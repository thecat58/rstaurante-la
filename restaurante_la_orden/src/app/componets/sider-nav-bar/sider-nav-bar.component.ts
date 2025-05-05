import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { side_routes } from '../sidebar.routes';

@Component({
  selector: 'app-sider-nav-bar',
  imports: [
    RouterModule,
    CommonModule,
    NzMenuModule,
    MenuItemComponent
  ], 
  templateUrl: './sider-nav-bar.component.html',
  styleUrl: './sider-nav-bar.component.css'
})
export class SidebarNavBarComponent {

  @Input({required:true}) collapsed:boolean = false;

  opciones_menu = side_routes;
}
