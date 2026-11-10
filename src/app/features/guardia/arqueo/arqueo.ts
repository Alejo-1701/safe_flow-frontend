import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '@shared/components/sidebar/sidebar';

interface CategoriaRecaudo {
  id: string;
  nombre: string;
  icono: string;
  tono: 'info' | 'ok';
  unidades: number;
  monto: number;
}

type EstadoDiferencia = 'ok' | 'faltante' | 'sobrante';

@Component({
  selector: 'app-arqueo',
  standalone: true,
  imports: [FormsModule, SidebarComponent],
  templateUrl: './arqueo.html',
  styleUrls: ['./arqueo.scss']
})
export class ArqueoComponent {
  private readonly router = inject(Router);

  /* ---------- Datos del guardia y navegación para el Sidebar compartido ---------- */
  readonly guardia = {
    nombre: 'Carlos Rodríguez',
    nombres: 'Carlos Andrés',
    apellidos: 'Rodríguez Peña',
    telefono: '+57 312 458 9201',
    email: 'carlos.rodriguez@safeflow.co',
    cargo: 'Guarda de seguridad',
    turno: 'Turno A',
    avatarUrl: ''
  };

  guardiaEditando = { ...this.guardia };

  readonly navItems = [
    { label: 'Dashboard', route: '/guardia', icon: 'dashboard' },
    { label: 'Recaudos', route: '/guardia/arqueo', icon: 'payments' },
    { label: 'Visitantes', route: '/guardia/historial-visitantes', icon: 'groups' }
  ];

  /* ---------- Modales y Estados ---------- */
  readonly modalActualizarAbierto = signal(false);
  readonly modalCierreAbierto = signal(false);

  /* ---------- Totales ---------- */
  readonly totalEfectivo = signal(0);
  readonly totalDigital = signal(0);
  readonly totalGeneral = computed(() => this.totalEfectivo() + this.totalDigital());

  readonly categorias = signal<CategoriaRecaudo[]>([
    { id: 'carros', nombre: 'Carros', icono: 'directions_car', tono: 'info', unidades: 0, monto: 0 },
    { id: 'motos', nombre: 'Motos', icono: 'two_wheeler', tono: 'ok', unidades: 0, monto: 0 }
  ]);

  readonly subtotal = computed(() =>
    this.categorias().reduce((suma, categoria) => suma + categoria.monto, 0)
  );

  /* ---------- Validación de efectivo ---------- */
  readonly montoFisicoTexto = signal('');
  readonly confirmado = signal(false);

  private readonly montoFisico = computed(
    () => parseFloat(this.montoFisicoTexto()) || 0
  );

  readonly diferencia = computed(() => {
    if (this.montoFisicoTexto() === '') {
      return 0;
    }

    return Math.round((this.montoFisico() - this.totalEfectivo()) * 100) / 100;
  });

  readonly estadoDiferencia = computed<EstadoDiferencia>(() => {
    const valor = this.diferencia();

    if (valor === 0) {
      return 'ok';
    }

    return valor < 0 ? 'faltante' : 'sobrante';
  });

  readonly iconoDiferencia = computed(() => {
    const iconos: Record<EstadoDiferencia, string> = {
      ok: 'check_circle',
      faltante: 'error',
      sobrante: 'warning'
    };

    return iconos[this.estadoDiferencia()];
  });

  readonly puedeConfirmar = computed(
    () => this.montoFisicoTexto() !== '' && !this.confirmado()
  );

  /* ---------- Formato ---------- */
  formatoMonto(valor: number): string {
    return '$ ' + valor.toLocaleString('en-US');
  }

  formatoDiferencia(valor: number): string {
    const absoluto = Math.abs(valor).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return (valor < 0 ? '-' : '') + '$ ' + absoluto;
  }

  /* ---------- Acciones y Modales ---------- */
  onMontoInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const [entero, ...resto] = input.value.replace(/[^\d.]/g, '').split('.');
    const limpio = resto.length
      ? `${entero}.${resto.join('').slice(0, 2)}`
      : entero;

    input.value = limpio;
    this.montoFisicoTexto.set(limpio);
  }

  confirmarCierre(): void {
    if (!this.puedeConfirmar()) {
      return;
    }
    this.confirmado.set(true);
  }

  actualizarDatos(): void {
    this.guardiaEditando = { ...this.guardia };
    this.modalActualizarAbierto.set(true);
  }

  cerrarModalActualizar(): void {
    this.modalActualizarAbierto.set(false);
  }

  guardarCambios(): void {
    this.guardia.nombres = this.guardiaEditando.nombres;
    this.guardia.apellidos = this.guardiaEditando.apellidos;
    this.guardia.nombre = `${this.guardiaEditando.nombres} ${this.guardiaEditando.apellidos}`;
    this.guardia.telefono = this.guardiaEditando.telefono;
    this.guardia.email = this.guardiaEditando.email;

    this.modalActualizarAbierto.set(false);
  }

  cerrarSesion(): void {
    this.modalCierreAbierto.set(true);
  }

  cerrarModalCierre(): void {
    this.modalCierreAbierto.set(false);
  }

  confirmarCierreSesion(): void {
    this.modalCierreAbierto.set(false);
    this.router.navigate(['/auth']);
  }
}
