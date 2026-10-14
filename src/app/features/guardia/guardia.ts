
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

// Componentes compartidos reutilizados (rutas inferidas de los templateUrl; ajústalas si tus archivos se llaman distinto)
import { ButtonComponent } from '../../shared/components/button/button';
import { CardWidgetComponent } from '../../shared/components/card-widget/card-widget.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { NavbarComponent } from '../../shared/components/navbar/navbar';

type EstadoVisita = 'aprobado' | 'pendiente' | 'rechazado';
type TipoBadge = 'success' | 'warning' | 'danger';

interface AlertaCritica {
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

interface VisitantePorAutorizar {
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
    ButtonComponent,
    CardWidgetComponent,
    StatusBadgeComponent,
    NavbarComponent
  ],
  templateUrl: './guardia.html',
  styleUrls: ['./guardia.scss']
})
export class GuardiaComponent {
  private readonly router = inject(Router);

  /* ---------- Datos del guardia (de ejemplo, sin backend) ---------- */
  readonly guardia = {
    nombre: 'Carlos Rodríguez',
    cargo: 'Guarda de seguridad',
    turno: 'Turno A',
    avatarUrl: '' // si se define una URL, se muestra la foto; si no, las iniciales
  };

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

  /* ---------- Cabecera ---------- */
  cerrarSesion(): void {
    // TODO: limpiar sesión/token cuando exista el servicio de autenticación
    this.router.navigate(['/auth']);
  }

  actualizarDatos(): void {
    console.info('Actualizar datos del guardia (funcionalidad pendiente)');
  }

  /* ---------- Manual de barreras ---------- */
  abrirBarrera(tipo: 'entrada' | 'salida'): void {
    // TODO: pendiente de backend/hardware (control de barreras). Aquí iría la llamada al servicio.
    console.info(`Solicitud de apertura de barrera de ${tipo} (sin backend conectado)`);
  }

  /* ---------- Visitantes por autorizar ---------- */
  permitirPaso(visitante: VisitantePorAutorizar): void {
    this.porAutorizar.update(lista => lista.filter(v => v.id !== visitante.id));
  }

  llamar(visitante: VisitantePorAutorizar): void {
    // TODO: pendiente de backend (intercomunicador / telefonía del residente)
    console.info(`Llamando al residente de ${visitante.ubicacion} (sin backend conectado)`);
  }

  denegar(visitante: VisitantePorAutorizar): void {
    this.porAutorizar.update(lista => lista.filter(v => v.id !== visitante.id));
  }

  verHistorialVisitantes(): void {
    // TODO: navegar a la vista de historial cuando exista su ruta
    console.info('Ver todos los registros de visitantes (ruta pendiente)');
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

    // Simulación en frontend: el registro real depende del backend
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
    // TODO: volver a consultar al backend; por ahora solo actualiza la hora de sincronización
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
    // La referencia no define el contenido de este menú: queda pendiente
    console.info(`Más acciones para ${visitante.placa} (menú sin definir)`);
  }

  /* ---------- Cierre de turno y cobros ---------- */
  realizarArqueo(): void {
    // TODO: pendiente de backend (arqueo de caja)
    console.info('Arqueo de caja solicitado (sin backend conectado)');
  }

  verTodosCobros(): void {
    // TODO: navegar al historial completo de cobros cuando exista su ruta
    console.info('Ver todos los cobros (ruta pendiente)');
  }
}
