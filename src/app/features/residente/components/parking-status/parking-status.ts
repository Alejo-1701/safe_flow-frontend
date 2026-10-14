import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';

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
  imports: [CommonModule, CardWidgetComponent],
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
}
