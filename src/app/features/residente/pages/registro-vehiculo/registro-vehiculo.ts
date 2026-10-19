import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent, NavItem, UserProfile } from '../../../../shared/components/sidebar/sidebar';
import { FormFieldComponent, FieldConfig } from '../../../../shared/components/form-field/form-field';

@Component({
  selector: 'app-registro-vehiculo',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormFieldComponent],
  templateUrl: './registro-vehiculo.html',
  styleUrl: './registro-vehiculo.scss',
})
export class RegistroVehiculo {

  /**
   * Navegación del menú lateral.
   * Se pasan con `[customNavItems]` (API del `app-sidebar` compartido), igual
   * que en "Mi Perfil". Las rutas son provisionales: la navegación definitiva
   * se definirá cuando existan el resto de las pantallas del portal.
   */
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/residente', icon: 'dashboard' },
    { label: 'Mi Perfil', route: '/residente/perfil', icon: 'person' },
    { label: 'Vehículos', route: '/residente/vehiculos', icon: 'directions_car' },
  ];

  /**
   * Datos del usuario en el pie del menú lateral.
   *
   * TODO: reemplazar por el residente autenticado.
   * Ej: this.authService.currentUser();
   */
  currentUser: UserProfile = {
    name: 'Juan Pérez',
    role: 'Torre A - 402'
  };

  /**
   * Campos de la tarjeta "Información del Vehículo".
   *
   * Los pinta `form-field`, que además genera el grid, marca todos los campos
   * como obligatorios y añade la botonera Cancelar / Registrar.
   *
   * Nota: el componente pone los inputs en mayúsculas por defecto (ideal para
   * la placa), así que marca, modelo y color lo desactivan con `uppercase: false`.
   */
  vehicleFields: FieldConfig[] = [
    {
      key: 'plate',
      label: 'Número de Placa',
      type: 'text',
      placeholder: 'ABC-1234'
    },
    {
      key: 'type',
      label: 'Tipo de Vehículo',
      type: 'select',
      value: 'Carro', // Opción por defecto del diseño.
      options: [
        { label: 'Carro', value: 'Carro' },
        { label: 'Moto', value: 'Moto' },
        { label: 'Camioneta', value: 'Camioneta' },
        { label: 'Bicicleta', value: 'Bicicleta' }
      ],
      uppercase: false
    },
    {
      key: 'brand',
      label: 'Marca',
      type: 'text',
      placeholder: 'ej. Tesla',
      uppercase: false
    },
    {
      key: 'model',
      label: 'Modelo',
      type: 'text',
      placeholder: 'ej. Model S',
      uppercase: false
    },
    {
      key: 'color',
      label: 'Color',
      type: 'text',
      placeholder: 'ej. Midnight Silver',
      uppercase: false
    }
  ];

  /**
   * Valor del campo "Color" que alimenta el indicador de la derecha.
   * Se publica en la variable CSS `--swatch-color` desde el HTML.
   */
  readonly colorPreview = signal('');

  /**
   * Refresca el indicador de color mientras se escribe.
   *
   * `form-field` no expone los cambios de cada control, pero el evento `input`
   * nativo burbujea hasta el elemento anfitrión, así que se escucha desde acá
   * sin modificar el componente compartido.
   */
  onFormInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;

    if (target?.id !== 'color') {
      return;
    }

    this.colorPreview.set(this.toCssColor(target.value));
  }

  /**
   * TODO: registrar el vehículo del residente.
   * El payload llega completo desde el formulario; hoy no se envía a ningún sitio.
   * Ej: this.vehiculosService.crear(payload);
   */
  onRegisterVehicle(_payload: unknown): void {
    // Lógica de backend pendiente.
  }

  /**
   * Cancela el registro y vuelve a la pantalla anterior.
   *
   * TODO: navegación definitiva.
   * Ej: this.router.navigate(['/residente']);
   */
  onCancel(): void {
    // Ruteo pendiente.
  }

  /**
   * Devuelve el texto solo si es un color CSS seguro; en caso contrario,
   * cadena vacía para que el indicador use su color por defecto.
   *
   * Es una salvaguarda (nada de `;`, comillas ni `url()`), no un catálogo:
   * TODO: la lista de colores válidos la entregará el backend.
   */
  private toCssColor(value: string): string {
    const color = value.trim().slice(0, 40);

    if (/url\s*\(/i.test(color)) {
      return '';
    }

    return /^[a-zA-Z#][a-zA-Z0-9#(),.%\s-]*$/.test(color) ? color : '';
  }
}
