import { Routes } from "@angular/router";

const roles_gestion:string[] = ['admin'];
const roles_reportes:string[] = ['admin','reporteador','consulta'];

export const side_routes:Routes = [
    {
        path:'gestion',
        title:'Gestión',
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'modalidades'
            },
            {
                path:'pedidos',
                title:'Pedidos',
                // data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie',roles:roles_reportes},
                loadComponent:()=>import('@domains/pagues/pedido/pedido.component').then(c=>c.PedidoComponent),
            },
            {
                path:'plato',
                title:'Platos',
                // data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie',roles:roles_reportes},
                loadComponent:()=>import('@domains/pagues/plato/plato.component').then(c=>c.PlatoComponent),
            },

           
        ]
    },
    {
        path:'reportes',
        title:'Reportes',
        data:{breadcrumb:'Reportes',icon:'heroChartPie',roles:roles_reportes},
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'general'
            },
            {
                path:'menu',
                title:'Menu Ordenes',
                // data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie',roles:roles_reportes},
                loadComponent:()=>import('@domains/pagues/menu/menu.component').then(c=>c.MenuComponent),
            },
           
        ]
    }
]