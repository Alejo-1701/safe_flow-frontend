import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  @Input() basePath: string = '/admin';
  @Input() currentUser: UserProfile = {
    name: 'Admin Juan',
    role: 'Super Admin'
  };

  // navItems como @Input() directo para permitir pasar el menú dinámico de cualquier portal (Admin, Residentes, Guardias, etc.)
  @Input() navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Residentes', route: '/residentes', icon: 'groups' },
    { label: 'Mapa', route: '/mapa', icon: 'map' },
    { label: 'Recaudos', route: '/recaudos', icon: 'payments' },
    { label: 'Solicitudes', route: '/solicitudes', icon: 'assignment' },
    { label: 'Reportes', route: '/reportes', icon: 'bar_chart' },
    { label: 'Configuración', route: '/configuracion', icon: 'settings' }
  ];

  // Estado para el menú hamburguesa en pantallas pequeñas
  isMobileMenuOpen: boolean = false;

  getFullRoute(route: string): string {
    if (route.startsWith('http') || route.startsWith(this.basePath)) {
      return route;
    }
    const cleanBase = this.basePath.endsWith('/') ? this.basePath.slice(0, -1) : this.basePath;
    const cleanRoute = route.startsWith('/') ? route : `/${route}`;
    return `${cleanBase}${cleanRoute}`;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    console.log('Cerrando sesión...');
  }
}
