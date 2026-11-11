import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { Modal } from '@shared/components/modal/modal';
import { ParkingService, SolicitudItem, ParkingSlot } from '@shared/services/parking.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, Modal],
  templateUrl: './solicitudes.html',
  styleUrls: ['./solicitudes.scss']
})
export class SolicitudesComponent implements OnInit, OnDestroy {
  private solicitudesSub!: Subscription;
  private carSub!: Subscription;
  private motoSub!: Subscription;

  solicitudesActivas: SolicitudItem[] = [];
  espaciosDisponiblesParaAsignar: ParkingSlot[] = [];

  totalCarrosLibres: number = 0;
  totalMotosLibres: number = 0;

  searchQuery: string = '';
  filtroEstado: string = 'TODOS';
  filtroTipoVehiculo: string = 'TODOS';

  isAsignarModalOpen: boolean = false;
  isPerfilModalOpen: boolean = false;
  isConfirmRechazoOpen: boolean = false;
  isSuccessModalOpen: boolean = false;

  modalTitle: string = '¡Operación Exitosa!';
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';

  isActionMenuOpenId: number | null = null;
  selectedSolicitud: SolicitudItem | null = null;
  selectedEspacioCelda: string = '';

  constructor(private parkingService: ParkingService) {}

  ngOnInit(): void {
    this.solicitudesSub = this.parkingService.solicitudes$.subscribe(todas => {
      this.solicitudesActivas = todas;
    });

    this.carSub = this.parkingService.carSlots$.subscribe(cars => {
      this.totalCarrosLibres = cars.filter(c => c.estado === 'libre').length;
    });

    this.motoSub = this.parkingService.motoSlots$.subscribe(motos => {
      this.totalMotosLibres = motos.filter(m => m.estado === 'libre').length;
    });
  }

  ngOnDestroy(): void {
    if (this.solicitudesSub) this.solicitudesSub.unsubscribe();
    if (this.carSub) this.carSub.unsubscribe();
    if (this.motoSub) this.motoSub.unsubscribe();
  }

  get siguienteEnTurno(): SolicitudItem | null {
    return this.solicitudesActivas.find(s => s.estado === 'PENDIENTE' || s.estado === 'EN ESPERA') || null;
  }

  get espaciosDisponiblesCount(): number {
    return this.totalCarrosLibres + this.totalMotosLibres;
  }

  get solicitudesEnEsperaCount(): number {
    return this.solicitudesActivas.filter(s => s.estado !== 'APROBADA').length;
  }

  get filteredSolicitudes(): SolicitudItem[] {
    return this.solicitudesActivas.filter(item => {
      const matchSearch = item.residenteNombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          item.placaVehiculo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          item.torreApto.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchEstado = this.filtroEstado === 'TODOS' || item.estado === this.filtroEstado;
      const matchTipo = this.filtroTipoVehiculo === 'TODOS' || item.tipoVehiculo.toLowerCase() === this.filtroTipoVehiculo.toLowerCase();

      return matchSearch && matchEstado && matchTipo && item.estado !== 'APROBADA';
    });
  }

  toggleActionMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.isActionMenuOpenId = this.isActionMenuOpenId === id ? null : id;
  }

  closeActionMenu(): void {
    this.isActionMenuOpenId = null;
  }

  openAsignarModal(solicitud: SolicitudItem | null = this.siguienteEnTurno): void {
    if (!solicitud) {
      this.modalTitle = 'Atención';
      this.modalMessage = 'No hay solicitudes pendientes en este momento.';
      this.modalType = 'error';
      this.isSuccessModalOpen = true;
      return;
    }

    this.selectedSolicitud = solicitud;
    this.selectedEspacioCelda = '';

    this.espaciosDisponiblesParaAsignar = this.parkingService.getAvailableSpaces(solicitud.categoriaEspacio)
      .sort((a, b) => Number(a.numero) - Number(b.numero));

    this.isAsignarModalOpen = true;
    this.closeActionMenu();
  }

  closeAsignarModal(): void {
    this.isAsignarModalOpen = false;
    this.selectedSolicitud = null;
  }

  confirmarAsignacion(): void {
    if (!this.selectedSolicitud || !this.selectedEspacioCelda) {
      this.modalTitle = 'Atención';
      this.modalMessage = 'Debe seleccionar un espacio disponible para continuar.';
      this.modalType = 'error';
      this.isSuccessModalOpen = true;
      return;
    }

    const exito = this.parkingService.asignarEspacio(this.selectedSolicitud.id, this.selectedEspacioCelda);

    if (exito) {
      this.closeAsignarModal();
      this.modalTitle = '¡Asignación Exitosa!';
      this.modalMessage = `Espacio #${this.selectedEspacioCelda} asignado correctamente. Sincronizado con el Mapa.`;
      this.modalType = 'success';
      this.isSuccessModalOpen = true;
    } else {
      this.modalTitle = 'Error de Asignación';
      this.modalMessage = 'El espacio seleccionado ya no se encuentra disponible.';
      this.modalType = 'error';
      this.isSuccessModalOpen = true;
    }
  }

  openPerfilModal(solicitud: SolicitudItem | null = this.siguienteEnTurno): void {
    if (!solicitud) return;
    this.selectedSolicitud = solicitud;
    this.isPerfilModalOpen = true;
    this.closeActionMenu();
  }

  closePerfilModal(): void {
    this.isPerfilModalOpen = false;
    this.selectedSolicitud = null;
  }

  contactarResidente(solicitud: SolicitudItem): void {
    this.modalTitle = 'Canal de Comunicación';
    this.modalMessage = `Abriendo canal de contacto con ${solicitud.residenteNombre} al teléfono ${solicitud.telefono}...`;
    this.modalType = 'success';
    this.isSuccessModalOpen = true;
    this.closeActionMenu();
  }

  pedirConfirmacionRechazo(solicitud: SolicitudItem): void {
    this.selectedSolicitud = solicitud;
    this.isConfirmRechazoOpen = true;
    this.closeActionMenu();
  }

  closeConfirmRechazo(): void {
    this.isConfirmRechazoOpen = false;
    this.selectedSolicitud = null;
  }

  ejecutarRechazo(): void {
    if (this.selectedSolicitud) {
      this.selectedSolicitud.estado = 'APROBADA';
      this.closeConfirmRechazo();
      this.modalTitle = 'Solicitud Rechazada';
      this.modalMessage = 'La solicitud ha sido rechazada y archivada correctamente.';
      this.modalType = 'success';
      this.isSuccessModalOpen = true;
    }
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }
}