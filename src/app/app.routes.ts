import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';
import { roleGuard } from './core/guards/role.guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./business/authentication/login/login.component'),
  },
  {
    path: 'restablecer-contra',
    loadComponent: () => import('./business/authentication/reset-password/reset-password.component')
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./shared/components/access-denied/access-denied.component')
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./business/inicio/inicio.component'),
        canActivate: [authGuard]
      },
      {
        path: 'reactivos',
        loadComponent: () => import('./business/reactivos/components/lista/lista.component'),
        canActivate: [authGuard]
      },
      {
        path: 'equipos',
        loadComponent: () => import('./business/equipos/components/lista/lista.component'),
        canActivate: [authGuard]
      },
      {
        path: 'reportes',
        loadComponent: () => import('./business/reportes/components/main/main.component'),
        canActivate: [roleGuard],
        data: { expectedRoles: ['mod', 'admin'] }
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./business/usuarios/components/main/main.component'),
        canActivate: [roleGuard],
        data: { expectedRoles: ['admin'] }
      },
      {
        path: 'categorias',
        loadComponent: () => import('./business/categorias/categorias.component'),
        canActivate: [roleGuard],
        data: { expectedRoles: ['mod', 'admin'] }
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./business/config/config.component'),
        canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
