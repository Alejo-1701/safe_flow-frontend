import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  role: string;
}

/* Alias con los nombres que usa el portal de residente. */
export type SidebarNavItem = NavItem;
export type SidebarUser = UserProfile;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  // Prefijo de ruta base dinámico para reutilizar el menú en cualquier portal (/admin, /residente, /guardia)
  @Input() basePath: string = '/admin';

  /** Título mostrado en la cabecera del menú. */
  @Input() title: string = 'Safe Flow';

  // Permite pasar ítems personalizados desde cualquier módulo si se requiere
  @Input() customNavItems?: NavItem[];

  // Permite pasar la información del usuario dinámicamente
  @Input() currentUser: UserProfile = {
    name: 'Admin Juan',
    role: 'Super Admin'
  };

  /** Muestra el botón de opciones (...) en el pie del menú. */
  @Input() showOptionsButton: boolean = false;

  /** Se emite al pulsar el botón de opciones (...). */
  @Output() optionsClick = new EventEmitter<void>();

  /** Se emite al pulsar el botón de salir/logout. */
  @Output() logoutClick = new EventEmitter<void>();

  defaultNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Residentes', route: '/residentes', icon: 'groups' },
    { label: 'Mapa', route: '/mapa', icon: 'map' },
    { label: 'Recaudos', route: '/recaudos', icon: 'payments' },
    { label: 'Solicitudes', route: '/solicitudes', icon: 'assignment' },
    { label: 'Reportes', route: '/reportes', icon: 'bar_chart' },
    { label: 'Configuración', route: '/configuracion', icon: 'settings' }
  ];

  /** Alias de entrada `[navItems]` (los ítems personalizados tienen prioridad). */
  @Input()
  set navItems(items: NavItem[] | undefined) {
    this.customNavItems = items;
  }

  get navItems(): NavItem[] {
    return this.customNavItems && this.customNavItems.length > 0
      ? this.customNavItems
      : this.defaultNavItems;
  }

  // Concatena la ruta base del módulo con la subruta del menú
  getFullRoute(route: string): string {
    if (route.startsWith('http') || route.startsWith(this.basePath)) {
      return route;
    }
    const cleanBase = this.basePath.endsWith('/') ? this.basePath.slice(0, -1) : this.basePath;
    const cleanRoute = route.startsWith('/') ? route : `/${route}`;
    return `${cleanBase}${cleanRoute}`;
  }

  onOptions(): void {
    this.optionsClick.emit();
  }

  logout(): void {
    // TODO: conectar con el servicio de autenticación (lógica pendiente).
    this.logoutClick.emit();
  }
}
