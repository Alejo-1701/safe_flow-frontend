import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

/** Vehículo registrado por el residente. */
export interface ResidentVehicle {
  plate: string;
  description: string;
  isPrimary: boolean;
}

@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [CommonModule, CardWidgetComponent, StatusBadgeComponent],
  templateUrl: './my-vehicles.html',
  styleUrl: './my-vehicles.scss',
})
export class MyVehiclesComponent {
  /** Listado de vehículos del residente (se completa desde el servicio). */
  @Input() vehicles: ResidentVehicle[] = [];

  @Output() register = new EventEmitter<void>();

  /**
   * Notifica al contenedor de que se pulsó "+ Registrar".
   * La navegación la resuelve quien conoce las rutas (`PortalResidente`, vía
   * `(register)="onRegisterVehicle()"`); aquí solo se emite el evento.
   */
  onRegister(): void {
    this.register.emit();
  }
}
