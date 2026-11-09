import { Routes } from '@angular/router';

export const GUARDIA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./guardia').then(m => m.GuardiaComponent)
  },
  {
    path: 'historial-visitantes',
    loadChildren: () =>
      import('./historial_visitantes/historial-visitantes.routes')
        .then(m => m.HISTORIAL_VISITANTES_ROUTES)
  },
  {
    path: 'arqueo',
    loadChildren: () =>
      import('./arqueo/arqueo.routes')
        .then(m => m.ARQUEO_ROUTES)
  }
];
