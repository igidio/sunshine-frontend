import { Routes } from '@angular/router';
import { MainLayout } from './layout/MainLayout/MainLayout';
import AuthLayout from './layout/AuthLayout/AuthLayout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/pages/main/main'),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login'),
  },
];
