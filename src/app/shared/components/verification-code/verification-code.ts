import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationCodeService } from '@shared/services/verification-code.service';

/**
 * Código de verificación de visitantes.
 *
 * Es el mismo bloque en las dos vistas del residente:
 *  - su barra superior (dentro del portal), y
 *  - su pantalla de inicio de sesión.
 *
 * Muestra el código vigente y un botón para copiarlo. **No** ofrece ningún
 * control para cambiarlo: rota solo cuando se agota su ventana de un minuto.
 *
 * La apariencia la adapta quien lo usa: en la barra se presenta como una pieza
 * compacta y en el login como un panel más grande con título.
 */
@Component({
  selector: 'app-verification-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verification-code.html',
  styleUrl: './verification-code.scss',
})
export class VerificationCodeComponent {
  private readonly verificationCode = inject(VerificationCodeService);

  /** Título opcional sobre el código (el login lo usa; la barra no). */
  @Input() heading = '';

  /** Aclaración opcional debajo del bloque. */
  @Input() note = '';

  /** Muestra el tiempo restante de la ventana. */
  @Input() showCountdown = true;

  /** Botón de copiar. En la barra es texto; en el login admite etiqueta propia. */
  @Input() copyLabel = 'Copiar';

  @Output() copied = new EventEmitter<string>();

  readonly code = this.verificationCode.code;
  readonly countdown = this.verificationCode.countdown;

  /** `true` durante los dos segundos posteriores a copiar. */
  copiado = false;

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copiado = true;
      this.copied.emit(this.code());
      setTimeout(() => (this.copiado = false), 2000);
    } catch {
      // Sin permiso de portapapeles el código sigue a la vista, así que no hay
      // nada que reparar: no se interrumpe al residente con un error.
      this.copiado = false;
    }
  }
}
