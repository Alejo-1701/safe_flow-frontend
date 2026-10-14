import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';

export type QuickAccessTarget = 'documentos' | 'reglamento';

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
    // TODO: navegar a la vista correspondiente.
    // Ej: this.router.navigate(['/residente/' + target]);
    this.navigate.emit(target);
  }
}
