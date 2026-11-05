import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface CategoriaRecaudo {
  id: string;
  nombre: string;
  icono: string; // nombre del ícono de Material Symbols
  tono: 'info' | 'ok';
  unidades: number;
  monto: number;
}

type EstadoDiferencia = 'ok' | 'faltante' | 'sobrante';

@Component({
  selector: 'app-arqueo',
  standalone: true,
  templateUrl: './arqueo.html',
  styleUrls: ['./arqueo.scss']
})
export class ArqueoComponent {
  private readonly router = inject(Router);

  /* ---------- Totales (app nueva: en cero hasta que haya backend) ---------- */
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

  /** Diferencia = lo contado físicamente - lo registrado en efectivo. Sin monto ingresado se muestra 0.00. */
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

  /* ---------- Acciones ---------- */
  onMontoInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Solo números y un punto decimal con máximo 2 decimales
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

    // TODO: pendiente de backend. Aquí iría el envío del cierre de turno
    // (efectivo contado y diferencia).
    this.confirmado.set(true);
  }

  /* ---------- Menú lateral ---------- */
  navegarA(seccion: 'Dashboard' | 'Recaudos' | 'Visitantes'): void {
    if (seccion === 'Dashboard') {
      this.router.navigate(['/guardia']);
    } else if (seccion === 'Recaudos') {
      this.router.navigate(['/guardia/arqueo']); // ✅ Corregido aquí
    } else {
      this.router.navigate(['/guardia/historial-visitantes']);
    }
  }

  cerrarSesion(): void {
    this.router.navigate(['/auth']);
  }
}
