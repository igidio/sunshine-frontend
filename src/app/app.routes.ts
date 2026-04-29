import { Routes } from '@angular/router';
import { MainLayout } from './shared/MainLayout/MainLayout';

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
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login'),
  },
];
