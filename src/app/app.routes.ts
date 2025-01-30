import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () => import('./business/authentication/login/login.component'),
  //   //canActivate: [authGuard]
  // },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./business/inicio/inicio.component'),
        //canActivate: [authGuard]
      },
      {
        path: 'reactivos',
        loadComponent: () => import('./business/reactivos/components/lista/lista.component'),
        //canActivate: [authGuard]
      },
      {
        path: 'equipos',
        loadComponent: () => import('./business/equipos/components/lista/lista.component'),
        //canActivate: [authGuard]
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
    redirectTo: 'home'
  }
];
