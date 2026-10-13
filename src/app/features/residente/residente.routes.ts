import { Routes } from '@angular/router';

export const RESIDENTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/portal-residente/portal-residente').then(m => m.PortalResidente)
  },
  {
    // Ruta provisional para visualizar la vista "Mi Perfil".
    // La navegación definitiva se definirá más adelante.
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil)
  }

  // ---------------------------------------------------------------------------
  // Espacios reservados para las vistas hijas del Portal Residente.
  // Se habilitarán cuando se definan las pantallas y la navegación final.
  // ---------------------------------------------------------------------------
  // { path: 'vehiculos',   loadComponent: () => import('./pages/vehiculos/vehiculos').then(m => m.Vehiculos) },
  // { path: 'solicitudes', loadComponent: () => import('./pages/solicitudes/solicitudes').then(m => m.Solicitudes) },
  // { path: 'documentos',  loadComponent: () => import('./pages/documentos/documentos').then(m => m.Documentos) },
  // { path: 'reglamento',  loadComponent: () => import('./pages/reglamento/reglamento').then(m => m.Reglamento) },
  // { path: 'visitas',     loadComponent: () => import('./pages/visitas/visitas').then(m => m.Visitas) },
];
