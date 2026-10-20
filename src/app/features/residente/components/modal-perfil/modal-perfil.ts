import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldComponent, FieldConfig } from '../../../../shared/components/form-field/form-field';
import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';
import { Modal } from '../../../../shared/components/modal/modal';

/**
 * "Editar Información Personal" como modal del Portal Residente.
 *
 * Es la antigua vista `pages/perfil` trasladada a un diálogo: conserva sus
 * tarjetas (datos del residente, cambio de contraseña y aviso de seguridad),
 * el texto de cabecera y el diálogo de confirmación al guardar.
 *
 * El contenedor (`PortalResidente`) decide cuándo abrirlo con `[open]` y
 * recibe `(cerrado)` cuando el residente cancela o cierra.
 */
@Component({
  selector: 'app-modal-perfil',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, CardWidgetComponent, Modal],
  templateUrl: './modal-perfil.html',
  styleUrl: './modal-perfil.scss',
})
export class ModalPerfilComponent {

  @Input() open = false;
  @Output() cerrado = new EventEmitter<void>();

  /**
   * Datos del residente.
   * Se dejan VACÍOS (sin valor precargado) para que los complete el backend;
   * solo se muestra una pista de formato como `placeholder`.
   */
  residentFields: FieldConfig[] = [
    {
      key: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'Ej. correo@dominio.com',
      uppercase: false
    },
    {
      key: 'phone',
      label: 'Teléfono',
      type: 'tel',
      placeholder: 'Ej. +54 11 0000 0000',
      uppercase: false
    },
  ];

  /** Campos del formulario de cambio de contraseña. */
  passwordFields: FieldConfig[] = [
    {
      key: 'currentPassword',
      label: 'Contraseña Actual',
      type: 'password',
      required: true,
      uppercase: false
    },
    {
      key: 'newPassword',
      label: 'Nueva Contraseña',
      type: 'password',
      placeholder: 'Mínimo 8 caracteres',
      required: true,
      uppercase: false
    },
  ];

  /** Mensaje informativo del banner de seguridad. */
  securityMessage: string =
    'Para cambios en la asignación de Torre o Apartamento, por favor comuníquese ' +
    'directamente con la administración del edificio presentando la documentación requerida.';

  /** Visibilidad del diálogo de confirmación "¡Datos Actualizados!". */
  readonly showSavedModal = signal(false);

  /** Textos del diálogo de confirmación. */
  readonly savedModalTitle = '¡Datos Actualizados!';
  readonly savedModalMessage =
    'Tu información personal ha sido actualizada correctamente en el sistema.';

  /** TODO: guardar los datos del residente (integración con backend pendiente). */
  onSaveResident(_payload: unknown): void {
    // Lógica pendiente. El diálogo se abre igual para poder revisar el flujo.
    this.showSavedModal.set(true);
  }

  /** TODO: actualizar la contraseña (integración con backend pendiente). */
  onSavePassword(_payload: unknown): void {
    // Lógica pendiente. El diálogo se abre igual para poder revisar el flujo.
    this.showSavedModal.set(true);
  }

  /** Cierra el diálogo de confirmación al pulsar "Continuar" o el overlay. */
  onCloseSavedModal(): void {
    this.showSavedModal.set(false);
  }

  /** Cierra el modal: botón "Cancelar" de la tarjeta de contraseña. */
  onCancel(): void {
    this.cerrado.emit();
  }
}
