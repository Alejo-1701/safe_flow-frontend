import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'residentes',
    loadComponent: () =>
      import('./residentes/residentes').then(m => m.ResidentesComponent)
  }
];
