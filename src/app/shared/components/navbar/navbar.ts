import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationCodeComponent } from '../verification-code/verification-code';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, VerificationCodeComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Residente';
  @Input() showSearch: boolean = false;
  @Input() avatarUrl?: string;

  /**
   * Muestra el código de verificación de visitantes en la barra.
   *
   * Se activa SOLO desde el portal del residente. Portería no lo enciende, así
   * que el código no aparece en esa vista.
   */
  @Input() showVerificationCode: boolean = false;

  @Output() logoutClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  onLogout(): void {
    this.logoutClick.emit();
  }

  onProfile(): void {
    this.profileClick.emit();
  }
}
