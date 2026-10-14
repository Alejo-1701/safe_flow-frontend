import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent, NavItem, UserProfile } from '../../../../shared/components/sidebar/sidebar';
import { FormFieldComponent, FieldConfig } from '../../../../shared/components/form-field/form-field';
import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormFieldComponent, CardWidgetComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {

  /**
   * Navegación del menú lateral.
   * Nota: las rutas son provisionales (placeholders). La navegación
   * definitiva se definirá cuando existan el resto de las pantallas.
   * Se pasan con `[customNavItems]` (API del `app-sidebar` compartido).
   */
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/residente', icon: 'dashboard' },
    { label: 'Mi Perfil', route: '/residente/perfil', icon: 'person' },
    { label: 'Vehículos', route: '/residente/vehiculos', icon: 'directions_car' },
  ];

  /**
   * Datos del usuario en el pie del menú lateral.
   * Se dejan vacíos para no mostrar datos de ejemplo.
   */
  currentUser: UserProfile = {
    name: '',
    role: ''
  };

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

  /** TODO: guardar los datos del residente (integración con backend pendiente). */
  onSaveResident(_payload: unknown): void {
    // Lógica pendiente.
  }

  /** TODO: actualizar la contraseña (integración con backend pendiente). */
  onSavePassword(_payload: unknown): void {
    // Lógica pendiente.
  }

  /** TODO: cancelar la edición / volver atrás (ruteo pendiente). */
  onCancel(): void {
    // Lógica pendiente.
  }
}
