import { Routes } from '@angular/router';
import { MainLayout } from './layout/MainLayout/MainLayout';
import AuthLayout from './layout/AuthLayout/AuthLayout';
import DashboardLayout from './layout/DashboardLayout/DashboardLayout';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/pages/main/main'),
      },
      {
        path: 'products',
        loadComponent: () => import('./features/landing/pages/products/products'),
      },
      {
        path: 'appointments',
        canMatch: [AuthGuard(true), RoleGuard(['customer'])],
        loadComponent: () =>
          import('./features/landing/pages/appointment/appointment'),
      },
      {
        path: 'orders',
        canMatch: [AuthGuard(true), RoleGuard(['customer'])],
        loadComponent: () => import('./features/landing/pages/orders/orders'),
      },
      {
        path: 'profile',
        canMatch: [AuthGuard(true), RoleGuard(['customer'])],
        loadComponent: () => import('./features/landing/pages/profile/profile'),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    canMatch: [AuthGuard(false)],

    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
  },
  {
    path: 'redirect',
    loadComponent: () => import('./features/redirect/redirect'),
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canMatch: [AuthGuard(true), RoleGuard(['admin', 'superuser', 'employer'])],
    loadChildren: () => import('./features/dashboard/dashboard.routes'),
  },
];
