import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorParkingMapComponent } from '../../../../shared/components/visitor-parking-map/visitor-parking-map';

/**
 * "Mapa de Parqueaderos de Visitantes" como modal del Portal Residente.
 *
 * Reutiliza el componente compartido `app-visitor-parking-map` fijando
 * `mode="residente"`: ese modo oculta las placas de los visitantes y no
 * habilita la interacción de celdas, así que la vista es estrictamente
 * informativa. La asignación de celdas sigue siendo exclusiva de portería.
 *
 * El contenedor (`PortalResidente`) decide cuándo abrirlo con `[open]` y
 * recibe `(cerrado)` al pulsar el botón de cierre o el fondo.
 */
@Component({
  selector: 'app-visitor-map-modal',
  standalone: true,
  imports: [CommonModule, VisitorParkingMapComponent],
  templateUrl: './visitor-map-modal.html',
  styleUrl: './visitor-map-modal.scss',
})
export class VisitorMapModalComponent {
  @Input() open = false;

  @Output() cerrado = new EventEmitter<void>();

  onClose(): void {
    this.cerrado.emit();
  }
}
