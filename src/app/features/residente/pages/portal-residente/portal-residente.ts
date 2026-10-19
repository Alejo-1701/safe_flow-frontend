import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { VisitorAlertComponent } from '../../components/visitor-alert/visitor-alert';
import { ParkingStatusComponent } from '../../components/parking-status/parking-status';
import { PreauthorizeGuestComponent } from '../../components/preauthorize-guest/preauthorize-guest';
import { MyVehiclesComponent } from '../../components/my-vehicles/my-vehicles';
import { MyRequestsComponent } from '../../components/my-requests/my-requests';
import { QuickAccessComponent } from '../../components/quick-access/quick-access';
import { RecentVisitsComponent } from '../../components/recent-visits/recent-visits';
import { NuevaSolicitudComponent } from '../../components/nueva-solicitud/nueva-solicitud';

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
    RecentVisitsComponent,
    NuevaSolicitudComponent
  ],
  templateUrl: './portal-residente.html',
  styleUrl: './portal-residente.scss',
})
export class PortalResidente {

  private readonly router = inject(Router);

  /** Datos del residente en sesión (se completarán desde el servicio de autenticación). */
  readonly resident = {
    name: '',
    role: ''
  };

  /** Estado de visibilidad del modal "Nueva Solicitud de Residente". */
  solicitudAbierta = false;

  /** Abre el modal desde el botón "Nueva Solicitud" de `app-my-requests`. */
  abrirSolicitud(): void {
    this.solicitudAbierta = true;
  }

  /** Cierra el modal sin enviar. */
  cerrarSolicitud(): void {
    this.solicitudAbierta = false;
  }

  /**
   * TODO: enviar la solicitud al backend.
   * El payload llega completo desde el formulario; hoy solo se registra.
   * Ej: this.solicitudesService.crear(payload);
   */
  enviarSolicitud(payload: Record<string, unknown>): void {
    this.solicitudAbierta = false;
  }

  /**
   * Abre el formulario de registro de vehículo. Es el destino del botón
   * "+ Registrar" de la tarjeta "Mis Vehículos" (`app-my-vehicles`).
   *
   * Nota: la ruta `/residente/vehiculos/nuevo` sigue siendo provisional.
   */
  onRegisterVehicle(): void {
    this.router.navigate(['/residente/vehiculos/nuevo']);
  }

  /**
   * Lleva a la vista "Mi Perfil". Es el destino del botón "Actualizar Datos"
   * y del chip de usuario de `app-navbar` (ambos emiten `profileClick`).
   *
   * Nota: la ruta `/residente/perfil` sigue siendo provisional; cuando se
   * defina la navegación definitiva, aquí se ajusta el destino.
   */
  onProfile(): void {
    this.router.navigate(['/residente/perfil']);
  }

  /**
   * TODO: cerrar la sesión del usuario.
   * Ej: this.authService.logout();
   */
  onLogout(): void {
    // Pendiente de lógica de autenticación.
  }
}
