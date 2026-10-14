import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// `import type` se borra al compilar: no genera un ciclo de imports en runtime
// aunque historial-visitantes.ts importe este componente como valor.
import type { RegistroVisitante } from './historial-visitantes';

@Component({
  selector: 'app-detalle-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-modal.html',
  styleUrls: ['./detalle-modal.scss']
})
export class DetalleModalComponent {
  @Input() detalle!: RegistroVisitante;

  @Output() cerrado = new EventEmitter<void>();

  cerrar(): void {
    this.cerrado.emit();
  }
}