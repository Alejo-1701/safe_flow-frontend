import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
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
  @Input() variant?: string; // Soporta variant="guardia" de forma opcional

  @Input() currentUser: UserProfile = {
    name: 'Admin Juan',
    role: 'Super Admin'
  };

  @Input() customNavItems?: NavItem[];
  @Input() navItems?: NavItem[];

  // Opcionales específicos para tu pantalla (por defecto desactivados para otros módulos)
  @Input() showUpdateData: boolean = false;
  @Output() updateDataClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  // Output legacy por si otros módulos usan onLogout
  @Output() onLogout = new EventEmitter<void>();

  defaultNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Residentes', route: '/residentes', icon: 'groups' },
    { label: 'Mapa', route: '/mapa', icon: 'map' },
    { label: 'Recaudos', route: '/recaudos', icon: 'payments' },
    { label: 'Solicitudes', route: '/solicitudes', icon: 'assignment' },
    { label: 'Reportes', route: '/reportes', icon: 'bar_chart' },
    { label: 'Configuración', route: '/configuracion', icon: 'settings' }
  ];

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

  isActive(item: NavItem): boolean {
    return this.getFullRoute(item.route) === this.activeRoute;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  triggerUpdateData(): void {
    if (this.updateDataClick.observed) {
      this.updateDataClick.emit();
    }
  }

  logout(): void {
    if (this.logoutClick.observed) {
      this.logoutClick.emit();
    } else if (this.onLogout.observed) {
      this.onLogout.emit();
    } else {
      console.log('Cerrando sesión predeterminada...');
      this.router.navigate(['/auth']);
    }
  }
}
