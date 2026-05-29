import { Routes } from '@angular/router';

export const dashboard_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main-page/main-page'),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar-page/calendar-page'),
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat-page/chat-page'),
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
    path: 'user',
    loadComponent: () => import('../user/pages/user-page/user-page'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

export default dashboard_routes;
