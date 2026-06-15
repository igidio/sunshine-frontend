import { Routes } from '@angular/router';

export const dashboard_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main-page/main-page'),
  },
  {
    path: 'appointment',
    loadComponent: () => import('./../appointment/pages/appointment-page/appointment-page'),
  },
  {
    path: 'chat',
    loadComponent: () => import('./../chat/pages/chat-page/chat-page'),
  },
  {
    path: 'supplier',
    loadComponent: () => import('./../supplier/pages/supplier-page/supplier-page'),
  },
  {
    path: 'customer',
    loadComponent: () => import('./../customer/pages/customer-page/customer-page'),
  },
  {
    path: 'treatment',
    loadComponent: () => import('./../treatments/pages/treatment-page/treatment-page'),
  },
  {
    path: 'product',
    loadComponent: () => import('./../product/pages/product-page/product-page'),
  },
  {
    path: 'notification',
    loadComponent: () => import('../notification/pages/notification-page/notification-page'),
  },
  {
    path: 'stock',
    loadComponent: () => import('../stock/pages/stock-page/stock-page'),
  },
  {
    path: 'sale',
    loadComponent: () => import('./../sale/pages/sale-page/sale-page'),
  },
  {
    path: 'user',
    loadComponent: () => import('../user/pages/user-page/user-page'),
  },
  {
    path: 'profile',
    loadComponent: () => import('../profile/pages/profile-page/profile-page'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

export default dashboard_routes;
