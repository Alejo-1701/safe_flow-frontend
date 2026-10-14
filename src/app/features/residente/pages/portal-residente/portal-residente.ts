import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { VisitorAlertComponent } from '../../components/visitor-alert/visitor-alert';
import { ParkingStatusComponent } from '../../components/parking-status/parking-status';
import { PreauthorizeGuestComponent } from '../../components/preauthorize-guest/preauthorize-guest';
import { MyVehiclesComponent } from '../../components/my-vehicles/my-vehicles';
import { MyRequestsComponent } from '../../components/my-requests/my-requests';
import { QuickAccessComponent } from '../../components/quick-access/quick-access';
import { RecentVisitsComponent } from '../../components/recent-visits/recent-visits';

@Component({
  selector: 'app-portal-residente',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    VisitorAlertComponent,
    ParkingStatusComponent,
    PreauthorizeGuestComponent,
    MyVehiclesComponent,
    MyRequestsComponent,
    QuickAccessComponent,
    RecentVisitsComponent
  ],
  templateUrl: './portal-residente.html',
  styleUrl: './portal-residente.scss',
})
export class PortalResidente {

  /** Datos del residente en sesión (se completarán desde el servicio de autenticación). */
  readonly resident = {
    name: '',
    role: ''
  };

  /**
   * TODO: navegar a la vista de actualización de datos del residente.
   * Ej: this.router.navigate(['/residente/perfil']);
   */
  onProfile(): void {
    // Pendiente de ruteo definitivo.
  }

  /**
   * TODO: cerrar la sesión del usuario.
   * Ej: this.authService.logout();
   */
  onLogout(): void {
    // Pendiente de lógica de autenticación.
  }
}
