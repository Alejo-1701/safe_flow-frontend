import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/** Elemento de navegación del menú lateral. */
export interface SidebarNavItem {
  label: string;
  route: string;
  icon: string;
}

/** Usuario mostrado en el pie del menú lateral. */
export interface SidebarUser {
  name: string;
  role: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {

  /** Título mostrado en la cabecera del menú. */
  @Input() title: string = 'Safe Flow';

  /** Opciones de navegación del menú lateral. */
  @Input() navItems: SidebarNavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Residentes', route: '/residentes', icon: 'groups' },
    { label: 'Mapa', route: '/mapa', icon: 'map' },
    { label: 'Recaudos', route: '/recaudos', icon: 'payments' },
    { label: 'Solicitudes', route: '/solicitudes', icon: 'assignment' },
    { label: 'Reportes', route: '/reportes', icon: 'bar_chart' },
    { label: 'Configuración', route: '/configuracion', icon: 'settings' }
  ];

  /** Usuario mostrado en el pie del menú. */
  @Input() currentUser: SidebarUser = {
    name: 'Admin Juan',
    role: 'Super Admin'
  };

  /** Muestra el botón de opciones (...) en el pie del menú. */
  @Input() showOptionsButton: boolean = false;

  /** Se emite al pulsar el botón de opciones (...). */
  @Output() optionsClick = new EventEmitter<void>();

  /** Se emite al pulsar el botón de salir/logout. */
  @Output() logoutClick = new EventEmitter<void>();

  onOptions(): void {
    this.optionsClick.emit();
  }

  logout(): void {
    // TODO: conectar con el servicio de autenticación (lógica pendiente).
    this.logoutClick.emit();
  }
}
