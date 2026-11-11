import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';
import { VehicleExitBannerComponent } from '../vehicle-exit-banner/vehicle-exit-banner';
import { Modal } from '../../../../shared/components/modal/modal';

/** Datos del vehículo asignado al residente. */
export interface AssignedVehicle {
  location: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-parking-status',
  standalone: true,
  imports: [CommonModule, CardWidgetComponent, VehicleExitBannerComponent, Modal],
  templateUrl: './parking-status.html',
  styleUrl: './parking-status.scss',
})
export class ParkingStatusComponent {
  /** Datos del vehículo asignado (se completan desde el servicio). */
  @Input() vehicle: AssignedVehicle = {
    location: '',
    plate: '',
    brand: '',
    model: '',
    color: '',
    photoUrl: ''
  };

  /** Modal de resultado de la acción de salida del vehículo. */
  feedbackModal = signal<{ title: string; message: string; type: 'success' | 'error' } | null>(null);

  /**
   * Acción "Dar Salida de mi Vehículo" del banner de aviso.
   *
   * TODO: registrar la salida del vehículo contra el backend.
   * Ej: this.vehiculosService.registrarSalida(this.vehicle.plate);
   */
  onExitVehicle(): void {
    // TODO: reemplazar con el resultado real del servicio (éxito/error).
    this.feedbackModal.set({
      title: 'Salida registrada',
      message: 'La salida de tu vehículo se registró correctamente.',
      type: 'success'
    });
  }

  /** Cierra el modal de resultado. */
  cerrarFeedback(): void {
    this.feedbackModal.set(null);
  }
}
