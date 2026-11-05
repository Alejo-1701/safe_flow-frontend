
import { Routes } from '@angular/router';

export const GUARDIA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./guardia').then(m => m.GuardiaComponent)
  },
  {
    path: 'historial-visitantes',
    loadComponent: () =>
      import('./historial_visitantes/historial-visitantes')
        .then(m => m.HistorialVisitantesComponent)
  }
];
