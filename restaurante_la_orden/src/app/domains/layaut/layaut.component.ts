import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SidebarNavBarComponent } from '../../componets/sider-nav-bar/sider-nav-bar.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { TokenService } from '@shared/services/token.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-layaut',
  imports: [RouterOutlet,    RouterOutlet,
      NzLayoutModule,
      SidebarNavBarComponent,
      NzBreadCrumbModule,
      NzSpinModule,],
  templateUrl: './layaut.component.html',
  styleUrl: './layaut.component.css'
})
export class LayautComponent {

  private token_service = inject(TokenService);
  private auth_service = inject(AuthService);

  sidebarCollapsed:boolean = false;
  // loading_user = this.auth_service.loading_user;

  // user = this.auth_service.usuario;

  ngOnInit(): void {
    console.log('auth layout');
  //   if(this.token_service.getToken() && !Boolean(this.user())){
  //     const usuario_sub = this.auth_service.me()
  //       .subscribe({
  //         next:(usuario)=>{
  //           this.auth_service.usuario.set(usuario);
  //           this.loading_user.update(()=>false);
  //         },
  //         error:()=>usuario_sub.unsubscribe(),
  //         complete:()=> usuario_sub.unsubscribe()
  //       });
  //   }
  }}