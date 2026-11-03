import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';

export type QuickAccessTarget = 'documentos' | 'reglamento' | 'mapa';

@Component({
  selector: 'app-quick-access',
  standalone: true,
  imports: [CommonModule, CardWidgetComponent],
  templateUrl: './quick-access.html',
  styleUrl: './quick-access.scss',
})
export class QuickAccessComponent {
  @Output() navigate = new EventEmitter<QuickAccessTarget>();

  onOpen(target: QuickAccessTarget): void {
    // El contenedor decide qué hacer con cada destino: `mapa` abre el modal
    // de solo lectura; el resto sigue pendiente de navegación.
    // Ej: this.router.navigate(['/residente/' + target]);
    this.navigate.emit(target);
  }
}
