import { Routes } from '@angular/router';
import { MainLayout } from './layout/MainLayout/MainLayout';
import AuthLayout from './layout/AuthLayout/AuthLayout';
import DashboardLayout from './layout/DashboardLayout/DashboardLayout';

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
    path: 'dashboard',
    component: DashboardLayout,
    loadChildren: () => import('./features/dashboard/dashboard.routes'),
  },
];
