import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SidebarNavBarComponent } from '../../../componets/sider-nav-bar/sider-nav-bar.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AuthService } from '@shared/services/auth.service';
import { TokenService } from '@shared/services/token.service';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet,
    RouterOutlet,
    NzLayoutModule,
    SidebarNavBarComponent,
    NzBreadCrumbModule,
    NzSpinModule,
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent implements OnInit{

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
  }
}
