import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userName']) {
      console.log('NavbarComponent: userName input changed to:', changes['userName'].currentValue);
    }
  }

  // Lógica para el menú hamburguesa
  isMenuOpen: boolean = false;

  @Output() logoutClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

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
