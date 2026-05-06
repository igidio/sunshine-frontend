import { Routes } from '@angular/router';

export const dashboard_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main-page/main-page'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

export default dashboard_routes;
