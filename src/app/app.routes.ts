import { Routes } from '@angular/router';
import { LoginComponent } from './Login/componentes/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./admin/componentes/dashboard/dashboard.component'),

    children: [
      {
        path: 'RegistrarCompras',
        loadComponent: () =>
          import(
            './compras/componentes/registrar-compra/registrar-compra.component'
          ),
      },
      {
        path: 'RegistrarVentas',
        loadComponent: () =>
          import(
            './ventas/componentes/registrar-venta/registrar-venta.component'
          ),
      },
      {
        path: 'Productos',
        loadComponent: () =>
          import(
            './movimiento/componentes/movimiento-page/movimiento-page.component'
          ),
      },

      {
        path: '**',
        redirectTo: 'Ventas',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
