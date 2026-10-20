import { Routes } from '@angular/router';

export const RESIDENTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/portal-residente/portal-residente').then(m => m.PortalResidente)
  }

  // ---------------------------------------------------------------------------
  // "Mi Perfil" y "Registrar Nuevo Vehículo" YA NO SON RUTAS.
  // Pasaron a ser modales del Portal Residente (`app-modal-perfil` y
  // `app-modal-registro-vehiculo`), que se abren desde "Actualizar Datos",
  // el chip de usuario y el botón "+ Registrar" de "Mis Vehículos".
  // ---------------------------------------------------------------------------

  // Espacios reservados para las futuras vistas hijas del Portal Residente.
  // Se habilitarán cuando se definan las pantallas y la navegación final.
  // { path: 'vehiculos',   loadComponent: () => import('./pages/vehiculos/vehiculos').then(m => m.Vehiculos) },
  // { path: 'solicitudes', loadComponent: () => import('./pages/solicitudes/solicitudes').then(m => m.Solicitudes) },
  // { path: 'documentos',  loadComponent: () => import('./pages/documentos/documentos').then(m => m.Documentos) },
  // { path: 'reglamento',  loadComponent: () => import('./pages/reglamento/reglamento').then(m => m.Reglamento) },
  // { path: 'visitas',     loadComponent: () => import('./pages/visitas/visitas').then(m => m.Visitas) },
];
