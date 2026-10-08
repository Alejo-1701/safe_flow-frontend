import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-widget.component.html',
  styleUrls: ['./card-widget.component.scss']
})
export class CardWidgetComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() badgeText?: string;
  @Input() badgeType: 'success' | 'warning' | 'danger' | 'info' = 'info';
  @Input() icon?: string;
  @Input() actionLabel?: string;

  @Output() actionClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}
