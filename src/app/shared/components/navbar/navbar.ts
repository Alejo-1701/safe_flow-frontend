import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { VerificationCodeComponent } from '../verification-code/verification-code';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, VerificationCodeComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnChanges {
  constructor(private router: Router) {}

  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Residente';
  @Input() showProfileButton: boolean = true;
  @Input() showSearch: boolean = false;
  @Input() avatarUrl?: string;

  /**
   * Muestra el código de verificación de visitantes en la barra.
   *
   * Se activa SOLO desde el portal del residente. Portería no lo enciende, así
   * que el código no aparece en esa vista.
   */
  @Input() showVerificationCode: boolean = false;

  // Lógica para el menú hamburguesa
  isMenuOpen: boolean = false;

  @Output() logoutClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userName']) {
      console.log('NavbarComponent: userName input changed to:', changes['userName'].currentValue);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout(): void {
    this.isMenuOpen = false; // Cierra el menú al accionar
    this.logoutClick.emit();
    this.router.navigate(['/auth']);
  }

  onProfile(): void {
    this.isMenuOpen = false; // Cierra el menú al accionar
    this.profileClick.emit();
  }
}
