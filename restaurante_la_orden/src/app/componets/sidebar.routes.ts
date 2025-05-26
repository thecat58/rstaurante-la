import { Routes } from "@angular/router";

const roles_gestion: string[] = ['admin'];
const roles_reportes: string[] = ['admin', 'reporteador', 'consulta'];

export const side_routes: Routes = [
    {
        data: { breadcrumb: 'Gestión', icon: 'heroHomeModernSolid', roles: roles_gestion },

        path: 'gestion',
        title: 'Gestión',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'modalidades'
            },
            {
                path: 'pedidos',
                title: 'Pedidos',
                data: { roles: ['Mesero', 'Administrador'] },
                loadComponent: () => import('@domains/pagues/pedido/pedido.component').then(c => c.PedidoComponent),
            },
            {
                path: 'plato',
                title: 'Platos',
                // data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie',roles:roles_reportes},
                loadComponent: () => import('@domains/pagues/plato/plato.component').then(c => c.PlatoComponent),
            },
            {
                path: 'mesas',
                title: 'Mesas',
                // data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie',roles:roles_reportes},
                loadComponent: () => import('@domains/pagues/mesas/mesas.component').then(c => c.MesasComponent),
            },
            {
                path: 'usuarios',
                title: 'Usuarios',
                data: { roles: ['Administrador'] },
                loadComponent: () => import('@domains/auth/auth-user/auth-user.component').then(c => c.AuthUserComponent),
            },
            {
                path: 'persmisos',
                title: 'Roles y Permisos',
                // data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie',roles:roles_reportes},
                loadComponent: () => import('@domains/auth/permisos/permisos.component').then(c => c.PermisosComponent),
            },


        ]
    },
    {
        path: 'reportes',
        title: 'Reportes',
        data: { breadcrumb: 'Reportes', icon: 'heroChartPie', roles: roles_reportes },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'general'
            },
            {
                path: 'menu',
                title: 'Menu Ordenes',
                // data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie',roles:roles_reportes},
                loadComponent: () => import('@domains/pagues/menu/menu.component').then(c => c.MenuComponent),
            },

        ]
    }
]