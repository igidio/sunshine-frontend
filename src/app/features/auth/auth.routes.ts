import { Routes } from '@angular/router';

export const auth_routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page'),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup-page/signup-page'),
  },
  {
    path: 'recovery',
    loadComponent: () => import('./pages/recovery-page/recovery-page'),
  },
  {
    path: 'password/:token',
    loadComponent: () => import('./pages/password-page/password-page'),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

export default auth_routes;
