import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Bloque de cierre de turno del dashboard de guardia.
 *
 * Es presentacional: el texto es estático y la única acción se emite hacia el
 * padre, que es quien decide qué hacer con ella.
 */
@Component({
  selector: 'app-cierre-turno',
  standalone: true,
  templateUrl: './cierre-turno.html',
  styleUrls: ['./cierre-turno.scss']
})
export class CierreTurnoComponent {
  @Output() arqueo = new EventEmitter<void>();
}