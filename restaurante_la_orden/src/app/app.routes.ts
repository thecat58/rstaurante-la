import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
    },
    {
        path: 'auth',
        loadChildren: () => import('@domains/auth/auth.routes').then(r => r.routes)
    },
    {
        path: 'pages',
        loadChildren: () => import('@domains/layaut.routes').then(r => r.routes)
    },

    {
        path: 'mesa/:mesa_id/menu',
        title: 'Menú',
        loadComponent: () =>
            import('@domains/pagues/menu/menu.component').then(m => m.MenuComponent)
    },
    {
        path: 'pdf',
        title: 'Menú',
        loadComponent: () =>
            import('@domains/pagues/facturas/facturas.component').then(m => m.FacturasComponent)
    },
    {
        path: 'facturas',
        title: 'Facturas',
        loadComponent: () =>
            import('@domains/pagues/factura/factura.component').then(f => f.FacturaComponent)
    }


];
