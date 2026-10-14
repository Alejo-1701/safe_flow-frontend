import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

export type RequestStatus = 'Pendiente' | 'En proceso' | 'Resuelta' | 'Rechazada';

/** Solicitud creada por el residente. */
export interface ResidentRequest {
  title: string;
  status: RequestStatus;
}

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, CardWidgetComponent, StatusBadgeComponent],
  templateUrl: './my-requests.html',
  styleUrl: './my-requests.scss',
})
export class MyRequestsComponent {
  /** Listado de solicitudes del residente (se completa desde el servicio). */
  @Input() requests: ResidentRequest[] = [];

  @Output() newRequest = new EventEmitter<void>();

  onNewRequest(): void {
    // TODO: navegar al formulario de creación de solicitud.
    // Ej: this.router.navigate(['/residente/solicitudes/nueva']);
    this.newRequest.emit();
  }

  badgeType(status: RequestStatus): 'warning' | 'info' | 'success' | 'danger' {
    switch (status) {
      case 'Pendiente':
        return 'warning';
      case 'En proceso':
        return 'info';
      case 'Resuelta':
        return 'success';
      case 'Rechazada':
        return 'danger';
      default:
        return 'info';
    }
  }
}
