import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Bloque de cierre de turno del dashboard de guardia.
 */
@Component({
  selector: 'app-cierre-turno',
  standalone: true,
  templateUrl: './cierre-turno.html',
  styleUrls: ['./cierre-turno.scss']
})
export class CierreTurnoComponent {
  @Output() arqueo = new EventEmitter<void>();

  dispararArqueo(): void {
    this.arqueo.emit();
  }
}
