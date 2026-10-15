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
  },
  {
    path: 'recaudos',
    loadComponent: () =>
      import('./recaudos/recaudos').then(m => m.RecaudosComponent)
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import('./reportes/reportes').then(m => m.ReportesComponent)
  },
  {
    path: 'mapa',
    loadComponent: () =>
      import('./mapa/mapa').then(m => m.MapaComponent)
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import('./solicitudes/solicitudes').then(m => m.SolicitudesComponent)
  },
  {
    path: 'configuracion',
    loadComponent: () =>
      import('./configuracion/configuracion').then(m => m.ConfiguracionComponent)
  }
];
