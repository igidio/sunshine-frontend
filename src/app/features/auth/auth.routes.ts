import { Routes } from '@angular/router';

export const auth_routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page'),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

export default auth_routes;
