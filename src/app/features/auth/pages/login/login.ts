
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { VerificationCodeComponent } from '../../../../shared/components/verification-code/verification-code';

/**
 * Tipo de usuario que entra al sistema.
 *
 * El backend todavía no existe, así que hoy es lo único que distingue al
 * residente del resto. Cuando el servidor resuelva el rol desde las
 * credenciales, este selector desaparece y `isResidente` se calcula con el
 * rol autenticado.
 */
export type LoginUserType = 'residente' | 'guardia' | 'admin' | 'propietario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, VerificationCodeComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnChanges {
  credentials = {
    identifier: '',
    password: '',
    rememberMe: false
  };

  /**
   * Tipo de usuario con el que se abre el formulario.
   *
   * Es la costura para el día que exista backend o una ruta propia del
   * residente: quien navegue al login podrá fijarlo (`[initialUserType]`) y el
   * código de verificación aparece sin que el usuario toque el selector.
   *
   * Ojo: `NgModel` reescribe el `<select>` en cada `whenStable`, así que este
   * input solo tiene efecto si se fija ANTES de montar la vista. Cambiar
   * `userType` por código con el selector ya renderizado no persiste.
   */
  @Input() initialUserType: LoginUserType = 'residente';

  /** Rol elegido en el formulario. */
  userType: LoginUserType = 'residente';

  /**
   * `ngOnChanges` y no `ngOnInit`: en los tests —y en cualquier vista que fije
   * el input después de crear el componente— el valor llega más tarde que la
   * inicialización, y el selector debe arrancar con el rol indicado.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialUserType']) {
      this.userType = this.initialUserType;
      this.errorMessage = '';
    }
  }

  /** Opciones del selector, en el orden en que se muestran. */
  readonly userTypes: { value: LoginUserType; label: string }[] = [
    { value: 'residente', label: 'Residente' },
    { value: 'guardia', label: 'Guardia' },
    { value: 'admin', label: 'Administrador' },
    { value: 'propietario', label: 'Propietario' }
  ];

  showPassword: boolean = false;
  errorMessage: string = '';

  /**
   * Cambiar de tipo de usuario invalida el error anterior: un mensaje sobre la
   * contraseña no aplica a otra pantalla de acceso.
   *
   * Se llama desde `(ngModelChange)` y no desde el setter de `userType`, porque
   * el setter muta el valor que `NgModel` está escribiendo y eso deja la vista
   * sin refrescar.
   */
  onUserTypeChange(_tipo: LoginUserType): void {
    this.errorMessage = '';
  }

  /**
   * El código de verificación de visitantes es exclusivo del residente.
   *
   * Depende del rol elegido, no de una constante: al cambiar el selector el
   * bloque desaparece, así que no queda visible para los demás usuarios.
   */
  get isResidente(): boolean {
    return this.userType === 'residente';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.credentials.identifier.trim()) {
      this.errorMessage = 'Ingresa tu correo electrónico o usuario.';
      return;
    }

    if (!this.credentials.password) {
      this.errorMessage = 'Ingresa tu contraseña.';
      return;
    }

    if (this.credentials.password.length > 128) {
      this.errorMessage = 'La contraseña supera la longitud permitida.';
      return;
    }

    console.log('Datos de inicio de sesión:', {
      identifier: this.credentials.identifier.trim(),
      userType: this.userType,
      rememberMe: this.credentials.rememberMe
    });

    this.errorMessage =
      'Falta conectar el inicio de sesión con el servidor.';
  }
}

