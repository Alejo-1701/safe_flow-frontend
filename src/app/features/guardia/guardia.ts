import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

// Componentes compartidos reutilizados
import { PanelLateralComponent } from './panel-lateral';
import { CierreTurnoComponent } from './cierre-turno';
import { CardWidgetComponent } from '../../shared/components/card-widget/card-widget.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { SidebarComponent } from '@shared/components/sidebar/sidebar';

type EstadoVisita = 'aprobado' | 'pendiente' | 'rechazado';
export type TipoBadge = 'success' | 'warning' | 'danger';

export interface AlertaCritica {
  titulo: string;
  detalle: string;
}

interface VisitanteActivo {
  id: number;
  placa: string;
  apartamento: string;
  nombre: string;
  horaIngreso: string;
  estado: EstadoVisita;
  tiempo: string;
  valor: number;
}

export interface VisitantePorAutorizar {
  id: number;
  nombre: string;
  ubicacion: string;
  cita?: string;
  estado: 'autorizado' | 'pendiente';
}

interface Cobro {
  placa: string;
  tiempo: string;
  valor: number;
  horaPago: string;
}

@Component({
  selector: 'app-guardia',
  standalone: true,
  imports: [
    PanelLateralComponent,
    CierreTurnoComponent,
    CardWidgetComponent,
    StatusBadgeComponent,
    SidebarComponent
  ],
  templateUrl: './guardia.html',
  styleUrls: ['./guardia.scss']
})
export class GuardiaComponent {
  private readonly router = inject(Router);

  /* ---------- Datos del guardia ---------- */
  readonly guardia = {
    nombre: 'Carlos Rodríguez',
    cargo: 'Guarda de seguridad',
    turno: 'Turno A',
    avatarUrl: ''
  };

  // Elementos de navegación para el Sidebar compartido
  readonly navItems = [
    { label: 'Dashboard', route: '/guardia', icon: 'dashboard' },
    { label: 'Recaudos', route: '/guardia/arqueo', icon: 'payments' },
    { label: 'Visitantes', route: '/guardia/historial-visitantes', icon: 'groups' }
  ];

  readonly iniciales = this.guardia.nombre
    .split(' ')
    .map(parte => parte[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  /* ---------- Estado de la vista ---------- */
  readonly ultimaSync = signal('10:45 AM');
  readonly busqueda = signal('');
  readonly busquedaInvalida = signal(false);

  readonly alertas = signal<AlertaCritica[]>([]);
  readonly porAutorizar = signal<VisitantePorAutorizar[]>([]);
  readonly visitantes = signal<VisitanteActivo[]>([]);
  readonly cobros = signal<Cobro[]>([]);

  /* ---------- Helpers de presentación ---------- */
  tipoBadge(estado: EstadoVisita): TipoBadge {
    const mapa: Record<EstadoVisita, TipoBadge> = {
      aprobado: 'success',
      pendiente: 'warning',
      rechazado: 'danger'
    };
    return mapa[estado];
  }

  etiquetaEstado(estado: EstadoVisita): string {
    const mapa: Record<EstadoVisita, string> = {
      aprobado: 'Aprobado',
      pendiente: 'Pendiente',
      rechazado: 'Rechazado'
    };
    return mapa[estado];
  }

  tipoBadgeAutorizacion(estado: 'autorizado' | 'pendiente'): TipoBadge {
    return estado === 'autorizado' ? 'success' : 'warning';
  }

  formatearValor(valor: number): string {
    return '$' + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private horaActual(): string {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  /* ---------- Cabecera / Acciones de Sesión ---------- */
  cerrarSesion(): void {
    this.router.navigate(['/auth']);
  }

  actualizarDatos(): void {
    console.info('Actualizar datos del guardia (funcionalidad pendiente)');
  }

  /* ---------- Manual de barreras ---------- */
  abrirBarrera(tipo: 'entrada' | 'salida'): void {
    console.info(`Solicitud de apertura de barrera de ${tipo}`);
  }

  /* ---------- Visitantes por autorizar ---------- */
  permitirPaso(visitante: VisitantePorAutorizar): void {
    this.porAutorizar.update(lista => lista.filter(v => v.id !== visitante.id));
  }

  llamar(visitante: VisitantePorAutorizar): void {
    console.info(`Llamando al residente de ${visitante.ubicacion}`);
  }

  denegar(visitante: VisitantePorAutorizar): void {
    this.porAutorizar.update(lista => lista.filter(v => v.id !== visitante.id));
  }

  verHistorialVisitantes(): void {
    this.router.navigate(['/guardia/historial-visitantes']);
  }

  /* ---------- Módulo de acceso rápido ---------- */
  onBuscar(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
    this.busquedaInvalida.set(false);
  }

  registrarEntrada(): void {
    const termino = this.busqueda().trim().toUpperCase();
    if (!termino) {
      this.busquedaInvalida.set(true);
      return;
    }

    this.visitantes.update(lista => [
      ...lista,
      {
        id: Date.now(),
        placa: termino,
        apartamento: '—',
        nombre: '—',
        horaIngreso: this.horaActual(),
        estado: 'pendiente',
        tiempo: '0h 00m',
        valor: 0
      }
    ]);
    this.busqueda.set('');
  }

  registrarSalida(): void {
    const termino = this.busqueda().trim().toUpperCase();
    const visitante = this.visitantes().find(v => v.placa === termino);

    if (!visitante) {
      this.busquedaInvalida.set(true);
      return;
    }

    this.cobrar(visitante);
    this.busqueda.set('');
  }

  /* ---------- Monitor de visitantes ---------- */
  actualizarLista(): void {
    this.ultimaSync.set(this.horaActual());
  }

  cobrar(visitante: VisitanteActivo): void {
    this.cobros.update(lista => [
      { placa: visitante.placa, tiempo: visitante.tiempo, valor: visitante.valor, horaPago: this.horaActual() },
      ...lista
    ]);
    this.visitantes.update(lista => lista.filter(v => v.id !== visitante.id));
  }

  masAcciones(visitante: VisitanteActivo): void {
    console.info(`Más acciones para ${visitante.placa}`);
  }

  /* ---------- Cierre de turno y cobros ---------- */
  realizarArqueo(): void {
    this.router.navigate(['/guardia/arqueo']);
  }

  verTodosCobros(): void {
    console.info('Ver todos los cobros (ruta pendiente)');
  }
}
