import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Residente';
  @Input() showSearch: boolean = false;
  @Input() avatarUrl?: string;

  @Output() logoutClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  onLogout(): void {
    this.logoutClick.emit();
  }

  onProfile(): void {
    this.profileClick.emit();
  }
}
