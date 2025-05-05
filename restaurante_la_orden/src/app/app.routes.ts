import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        pathMatch:'full',
        redirectTo:'auth'
    },
    {
        path:'auth',
        loadChildren: ()=>import('@domains/auth/auth.routes').then(r=>r.routes)
    },
    {
        path:'pagues/mesas',
        title:'mesas',
        loadComponent: ()=> import('@domains/pagues/mesas/mesas.component').then(c=>c.MesasComponent)
    },
    {
        path: 'mesa/:mesa_id/menu',
        title: 'Menú',
        loadComponent: () =>
        import('@domains/pagues/menu/menu.component').then(m => m.MenuComponent)
    },
    {
        path: 'facturas',
        title: 'Facturas',
        loadComponent: () =>
            import('@domains/pagues/factura/factura.component').then(f => f.FacturaComponent)    }
      
];
