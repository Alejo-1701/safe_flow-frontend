import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

/** Ventana de validez de cada código, en segundos. */
export const VERIFICATION_CODE_TTL_SECONDS = 60;

/**
 * Código de verificación de visitantes: seis dígitos que el residente le dicta
 * al visitante y que deben entrar en portería dentro de una ventana de tiempo.
 *
 * Hoy es **solo frontend**: el código se genera y se rota en memoria, sin
 * backend. Por eso:
 *  - No sobrevive a una recarga (al recargar se emite uno nuevo, que es el
 *    comportamiento seguro: un código viejo no vuelve a quedar válido).
 *  - Un guardia en otra máquina no puede validarlo todavía. Cuando exista el
 *    backend, `onRotate` pasa a publicar el código y la cuenta atrás debe
 *    sincronizarse contra el `expiresAt` que devuelva el servidor, no contra
 *    un temporizador local.
 *
 * El servicio es `providedIn: 'root'` a propósito: la cuenta atrás sigue
 * corriendo aunque el componente que la muestra se destruya, y al volver a
 * montarlo se ve el estado real en lugar de reiniciar el minuto.
 */
@Injectable({ providedIn: 'root' })
export class VerificationCodeService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly codeSignal = signal(this.generateCode());
  private readonly secondsLeftSignal = signal(VERIFICATION_CODE_TTL_SECONDS);

  /** Código vigente, de seis dígitos. */
  readonly code = this.codeSignal.asReadonly();

  /** Segundos restantes antes de que el código se regenere. */
  readonly secondsLeft = this.secondsLeftSignal.asReadonly();

  /** Fracción transcurrida de la ventana, de 0 a 1 (para la barra de progreso). */
  readonly progress = computed(() => this.secondsLeftSignal() / VERIFICATION_CODE_TTL_SECONDS);

  /** Cuenta atrás formateada como `0:59`. */
  readonly countdown = computed(() => {
    const seconds = this.secondsLeftSignal();
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  });

  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    this.startTimer();
    // Sin esto, el interval sigue vivo después de destruir la app y un test
    // que cree el servicio más de una vez acumula varios temporizadores.
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  /**
   * Invalida el código actual y emite uno nuevo de inmediato.
   *
   * Es privado al servicio a propósito: el código solo rota cuando se agota su
   * ventana, nunca a pedido del usuario. La UI no expone ningún control para
   * adelantarlo.
   */
  private refresh(): void {
    this.codeSignal.set(this.generateCode());
    this.secondsLeftSignal.set(VERIFICATION_CODE_TTL_SECONDS);
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      // Al llegar a cero se emite el código siguiente, sin segundo de espera.
      if (this.secondsLeftSignal() <= 1) {
        this.refresh();
      } else {
        this.secondsLeftSignal.update((seconds) => seconds - 1);
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  /** Seis dígitos aleatorios, con ceros a la izquierda preservados (`000123`). */
  private generateCode(): string {
    const max = 1_000_000;
    const random = Math.floor(Math.random() * max);
    return random.toString().padStart(6, '0');
  }
}
