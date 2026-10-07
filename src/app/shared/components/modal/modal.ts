import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-modal',
  styleUrl: './modal.scss',
  templateUrl: './modal.html',
})
export class Modal {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Input() buttonText: string = 'Continuar';
  
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
