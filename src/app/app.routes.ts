import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    // canActivate: [AdminGuard]
  },
  {
    path: 'residente',
    loadChildren: () => import('./features/residente/residente.routes').then(m => m.RESIDENTE_ROUTES),
    // canActivate: [ResidenteGuard]
  },
  {
    path: 'guardia',
    loadChildren: () => import('./features/guardia/guardia.routes').then(m => m.GUARDIA_ROUTES),
    // canActivate: [GuardiaGuard]
  },
  {
    path: 'propietario',
    loadChildren: () => import('./features/propietario/propietario.routes').then(m => m.PROPIETARIO_ROUTES),
    // canActivate: [PropietarioGuard]
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
