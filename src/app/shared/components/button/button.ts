import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss']
})
export class ButtonComponent {
  @Input() text: string = 'Botón';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() colorVariant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() disabled: boolean = false;
  @Input() showArrow: boolean = false;

  @Output() onClick = new EventEmitter<Event>();

  onButtonClick(event: Event): void {
    if (!this.disabled) {
      this.onClick.emit(event);
    }
  }
}
