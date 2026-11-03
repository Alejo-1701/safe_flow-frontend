import { Routes } from '@angular/router';
import { PropietarioDashboardComponent } from './pages/dashboard/propietario-dashboard.component';
import { UnidadDetalleComponent } from './pages/unidad-detalle/unidad-detalle.component';
import { AsignarInquilinoComponent } from './pages/asignar-inquilino/asignar-inquilino.component';
import { GestionarInquilinosComponent } from './gestionar-inquilinos/gestionar-inquilinos.component';

import { TodasPropiedadesComponent } from './pages/todas-propiedades/todas-propiedades.component';

export const PROPIETARIO_ROUTES: Routes = [
  { path: '', component: PropietarioDashboardComponent },
  { path: 'todas', component: TodasPropiedadesComponent },
  { path: 'unidad/:id', component: UnidadDetalleComponent },
  { path: 'asignar/:id', component: AsignarInquilinoComponent },
  { path: 'gestionar-inquilinos', component: GestionarInquilinosComponent }
];
