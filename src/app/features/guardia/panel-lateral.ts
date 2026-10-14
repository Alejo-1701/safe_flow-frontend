import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Signal } from '@angular/core';

import { ButtonComponent } from '../../shared/components/button/button';
import { CardWidgetComponent } from '../../shared/components/card-widget/card-widget.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';

// `import type` se borra al compilar: evita el ciclo con el padre, que importa
// este componente como valor.
import type { AlertaCritica, TipoBadge, VisitantePorAutorizar } from './guardia';

/**
 * Columna izquierda del dashboard de guardia: control de barreras, alertas
 * críticas, visitantes por autorizar y acceso al historial.
 *
 * Es presentacional. Recibe datos por signal y emite intenciones; ninguna regla
 * de negocio vive aquí — el padre conserva la lógica y el estado.
 */
@Component({
  selector: 'app-panel-lateral',
  standalone: true,
  imports: [ButtonComponent, CardWidgetComponent, StatusBadgeComponent],
  templateUrl: './panel-lateral.html',
  styleUrls: ['./panel-lateral.scss']
})
export class PanelLateralComponent {
  @Input() alertas!: Signal<AlertaCritica[]>;
  @Input() porAutorizar!: Signal<VisitantePorAutorizar[]>;

  @Output() abrirBarrera = new EventEmitter<'entrada' | 'salida'>();
  @Output() permitirPaso = new EventEmitter<VisitantePorAutorizar>();
  @Output() llamar = new EventEmitter<VisitantePorAutorizar>();
  @Output() denegar = new EventEmitter<VisitantePorAutorizar>();
  @Output() verHistorial = new EventEmitter<void>();

  /**
   * Venía del padre, bajo "Helpers de presentación": mapea estado a tipo de
   * badge. Es lógica de presentación, así que acompaña al template.
   */
  tipoBadgeAutorizacion(estado: 'autorizado' | 'pendiente'): TipoBadge {
    return estado === 'autorizado' ? 'success' : 'warning';
  }
}