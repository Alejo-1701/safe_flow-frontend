import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-visitor-alert',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './visitor-alert.html',
  styleUrl: './visitor-alert.scss',
})
export class VisitorAlertComponent {
  @Input() title: string = 'Visitante en Portería';
  /** Nombre del visitante (opcional, se muestra si el servicio lo entrega). */
  @Input() visitorName?: string;
  /** Detalle adicional de la notificación (opcional). */
  @Input() message?: string;

  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  onApprove(): void {
    // TODO: confirmar el ingreso del visitante contra el servicio.
    this.approve.emit();
  }

  onReject(): void {
    // TODO: rechazar el ingreso del visitante contra el servicio.
    this.reject.emit();
  }
}
