import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';
import { VehicleExitBannerComponent } from '../vehicle-exit-banner/vehicle-exit-banner';

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
  imports: [CommonModule, CardWidgetComponent, VehicleExitBannerComponent],
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

  /**
   * Acción "Dar Salida de mi Vehículo" del banner de aviso.
   *
   * TODO: registrar la salida del vehículo contra el backend.
   * Ej: this.vehiculosService.registrarSalida(this.vehicle.plate);
   */
  onExitVehicle(): void {
    // Pendiente de la integración con el servicio de vehículos.
  }
}
