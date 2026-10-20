import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { VisitorAlertComponent } from '../../components/visitor-alert/visitor-alert';
import { ParkingStatusComponent } from '../../components/parking-status/parking-status';
import { PreauthorizeGuestComponent } from '../../components/preauthorize-guest/preauthorize-guest';
import { MyVehiclesComponent } from '../../components/my-vehicles/my-vehicles';
import { MyRequestsComponent } from '../../components/my-requests/my-requests';
import { QuickAccessComponent } from '../../components/quick-access/quick-access';
import { RecentVisitsComponent } from '../../components/recent-visits/recent-visits';
import { NuevaSolicitudComponent } from '../../components/nueva-solicitud/nueva-solicitud';
import { ModalPerfilComponent } from '../../components/modal-perfil/modal-perfil';
import { ModalRegistroVehiculoComponent } from '../../components/modal-registro-vehiculo/modal-registro-vehiculo';

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
    NuevaSolicitudComponent,
    ModalPerfilComponent,
    ModalRegistroVehiculoComponent
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

  /** Estado de visibilidad del modal "Nueva Solicitud de Residente". */
  solicitudAbierta = false;

  /**
   * Modales que antes eran vistas con ruta propia ("Mi Perfil" y
   * "Registrar Nuevo Vehículo"). Ahora se abren desde el portal, así que ya
   * no hay navegación de por medio.
   */
  readonly perfilAbierto = signal(false);
  readonly vehiculoAbierto = signal(false);

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
   * Abre el modal "Registrar Nuevo Vehículo". Es el destino del botón
   * "+ Registrar" de la tarjeta "Mis Vehículos" (`app-my-vehicles`).
   */
  onRegisterVehicle(): void {
    this.vehiculoAbierto.set(true);
  }

  /** Cierra el modal de registro de vehículo. */
  cerrarRegistroVehiculo(): void {
    this.vehiculoAbierto.set(false);
  }

  /**
   * Abre el modal "Editar Información Personal". Es el destino del botón
   * "Actualizar Datos" y del chip de usuario de `app-navbar` (ambos emiten
   * `profileClick`).
   */
  onProfile(): void {
    this.perfilAbierto.set(true);
  }

  /** Cierra el modal de perfil. */
  cerrarPerfil(): void {
    this.perfilAbierto.set(false);
  }

  /**
   * TODO: cerrar la sesión del usuario.
   * Ej: this.authService.logout();
   */
  onLogout(): void {
    // Pendiente de lógica de autenticación.
  }
}
