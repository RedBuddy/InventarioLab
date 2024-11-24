import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./business/authentication/login/login.component'),
    //canActivate: [authGuard]
  },
  // {
  //   path: '',
  //   loadComponent: () => import('./shared/components/layout/layout.component'),
  //   children: [
  //     {
  //       path: 'login',
  //       loadComponent: () => import('./business/authentication/login/login.component'),
  //       //canActivate: [authGuard]
  //     },
  //   ]
  // },

  {
    path: '**',
    redirectTo: 'home'
  }
];
