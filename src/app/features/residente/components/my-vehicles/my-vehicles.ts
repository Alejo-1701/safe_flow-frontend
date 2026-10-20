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
   * La acción la resuelve quien conoce el flujo (`PortalResidente`, vía
   * `(register)="onRegisterVehicle()"`), que abre el modal de registro;
   * aquí solo se emite el evento.
   */
  onRegister(): void {
    this.register.emit();
  }
}
