import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.html',
  styleUrls: ['./status-badge.scss']
})
export class StatusBadgeComponent {
  @Input() statusType: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'info';
  @Input() showDot: boolean = true;
}
