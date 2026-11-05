import { Routes } from '@angular/router';

export const ARQUEO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./arqueo').then(m => m.ArqueoComponent)
  }
];
