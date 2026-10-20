import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../../../shared/components/button/button';

/**
 * Banner de aviso de salida de vehículo.
 *
 * Barra horizontal que cierra la tarjeta "Estado de Parqueadero": a la
 * izquierda el icono informativo con el aviso a la portería y a la derecha la
 * acción principal "Dar Salida de mi Vehículo".
 *
 * Reutiliza `app-button`. El color de advertencia y el icono de salida se
 * aplican por `::ng-deep` desde su SCSS, igual que hace `visitor-alert`, para
 * no modificar el componente compartido ni duplicar botones.
 *
 * No conoce servicios ni rutas: solo emite `exitRequested` y el contenedor
 * (`ParkingStatusComponent`) decide qué hacer con la acción.
 */
@Component({
  selector: 'app-vehicle-exit-banner',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './vehicle-exit-banner.html',
  styleUrl: './vehicle-exit-banner.scss',
})
export class VehicleExitBannerComponent {
  /** Se emite al pulsar "Dar Salida de mi Vehículo". */
  @Output() exitRequested = new EventEmitter<void>();

  onExit(): void {
    this.exitRequested.emit();
  }
}
