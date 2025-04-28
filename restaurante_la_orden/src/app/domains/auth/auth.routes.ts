import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/auth/auth-layout/auth-layout.component').then(c=>c.AuthLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'login'
            },
            {
                path:'login',
                title:'Login',
                loadComponent: ()=> import('@domains/auth/login/login.component').then(c=>c.LoginComponent)
            },

        ]
    }
];