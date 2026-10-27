import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { ParkingService, SolicitudItem, ParkingSlot } from '@shared/services/parking.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
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
      alert('No hay solicitudes pendientes.');
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
      alert('Debe seleccionar un espacio disponible.');
      return;
    }

    const exito = this.parkingService.asignarEspacio(this.selectedSolicitud.id, this.selectedEspacioCelda);

    if (exito) {
      alert(`¡Asignación exitosa al espacio #${this.selectedEspacioCelda}! Sincronizado con el Mapa.`);
      this.closeAsignarModal();
    } else {
      alert('Error: El espacio seleccionado ya no está disponible.');
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
    alert(`Abriendo canal de comunicación con ${solicitud.residenteNombre} al teléfono ${solicitud.telefono}...`);
    this.closeActionMenu();
  }

  rechazarSolicitud(solicitud: SolicitudItem): void {
    if (confirm(`¿Está seguro de rechazar la solicitud de parqueadero para ${solicitud.residenteNombre}?`)) {
      solicitud.estado = 'APROBADA';
      alert('Solicitud rechazada y archivada.');
    }
    this.closeActionMenu();
  }
}
