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
  },
  {
    // El ítem "Vehículos" del menú apunta a la sección, y hoy su única
    // pantalla es el formulario de registro. Sin esta redirección la ruta
    // no existía y el comodín `**` mandaba al login.
    // Cuando exista el listado de vehículos, se sustituye por su página.
    path: 'vehiculos',
    pathMatch: 'full',
    redirectTo: 'vehiculos/nuevo'
  },
  {
    // Ruta provisional para visualizar la vista "Registrar Nuevo Vehículo".
    // Es la URL que anuncia `MyVehiclesComponent.onRegister()`.
    // La navegación definitiva se definirá más adelante.
    path: 'vehiculos/nuevo',
    loadComponent: () =>
      import('./pages/registro-vehiculo/registro-vehiculo').then(m => m.RegistroVehiculo)
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
