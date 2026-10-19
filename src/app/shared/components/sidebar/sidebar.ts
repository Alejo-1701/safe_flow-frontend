import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

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

  // Soporta tanto [customNavItems] como [navItems] opcionales
  @Input() customNavItems?: NavItem[];
  @Input() navItems?: NavItem[];

  defaultNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Residentes', route: '/residentes', icon: 'groups' },
    { label: 'Mapa', route: '/mapa', icon: 'map' },
    { label: 'Recaudos', route: '/recaudos', icon: 'payments' },
    { label: 'Solicitudes', route: '/solicitudes', icon: 'assignment' },
    { label: 'Reportes', route: '/reportes', icon: 'bar_chart' },
    { label: 'Configuración', route: '/configuracion', icon: 'settings' }
  ];

  // Si no se pasa ninguna lista personalizada, devuelve el menú de administración por defecto
  get displayNavItems(): NavItem[] {
    if (this.customNavItems && this.customNavItems.length > 0) {
      return this.customNavItems;
    }
    if (this.navItems && this.navItems.length > 0) {
      return this.navItems;
    }
    return this.defaultNavItems;
  }

  isMobileMenuOpen: boolean = false;

  private readonly router = inject(Router);

  /**
   * URL actual, reactiva: se actualiza en cada navegación.
   * Se usa para resaltar el enlace de la pantalla en la que está el usuario.
   */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  getFullRoute(route: string): string {
    if (route.startsWith('http') || route.startsWith(this.basePath)) {
      return route;
    }
    const cleanBase = this.basePath.endsWith('/') ? this.basePath.slice(0, -1) : this.basePath;
    const cleanRoute = route.startsWith('/') ? route : `/${route}`;
    return `${cleanBase}${cleanRoute}`;
  }

  /**
   * Destino del enlace que debe aparecer resaltado, o `null` si ninguno lo está.
   *
   * `routerLinkActive` de Angular (con `exact: false`) marca TODOS los enlaces
   * cuyo destino sea prefijo de la URL actual: en "/residente/perfil" encendía
   * a la vez "Dashboard" (`/residente`) y "Mi Perfil". Aquí se elige solo el
   * destino más específico de los que coinciden.
   */
  get activeRoute(): string | null {
    const url = this.currentUrl().split('?')[0].split('#')[0];
    let activeRoute: string | null = null;

    for (const item of this.displayNavItems) {
      const route = this.getFullRoute(item.route);
      const matches = url === route || url.startsWith(`${route}/`);

      if (matches && (activeRoute === null || route.length > activeRoute.length)) {
        activeRoute = route;
      }
    }

    return activeRoute;
  }

  /** Indica si el enlace corresponde a la pantalla actual. */
  isActive(item: NavItem): boolean {
    return this.getFullRoute(item.route) === this.activeRoute;
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
