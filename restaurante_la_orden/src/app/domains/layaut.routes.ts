import { Routes } from '@angular/router';
import { side_routes } from '../componets/sidebar.routes';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () =>
            import('@domains/layaut/layaut.component').then(m => m.LayautComponent),
        children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'pages'
        },...side_routes,
        {
            path: 'mesas',
            title: 'mesas',
            loadComponent: () => import('@domains/pagues/mesas/mesas.component').then(c => c.MesasComponent)
        },
        
        ]
    },


];
