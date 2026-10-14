import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTableComponent, ColumnDefinition } from '../../../../shared/components/data-table/data-table';
import { ButtonComponent } from '../../../../shared/components/button/button';

export type VisitState = 'Ingresó' | 'Salió' | 'Rechazado';

/** Registro del historial de visitas. */
export interface VisitRecord {
  date: string;
  visitor: string;
  vehicle: string;
  status: VisitState;
}

@Component({
  selector: 'app-recent-visits',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ButtonComponent],
  templateUrl: './recent-visits.html',
  styleUrl: './recent-visits.scss',
})
export class RecentVisitsComponent {
  columns: ColumnDefinition[] = [
    { key: 'date', label: 'Fecha' },
    { key: 'visitor', label: 'Visitante' },
    { key: 'vehicle', label: 'Vehículo' },
    { key: 'status', label: 'Estado' }
    // TODO: agregar columna "Acciones" cuando `app-data-table` soporte
    // plantillas de celda por columna (hoy proyecta la misma plantilla a todas).
  ];

  /** Historial de visitas (se completa desde el servicio). */
  @Input() visits: VisitRecord[] = [];

  @Output() viewAll = new EventEmitter<void>();

  onViewAll(): void {
    // TODO: navegar al historial completo de visitas.
    // Ej: this.router.navigate(['/residente/visitas']);
    this.viewAll.emit();
  }
}
