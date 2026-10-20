import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldComponent, FieldConfig } from '../../../../shared/components/form-field/form-field';

/**
 * "Registrar Nuevo Vehículo" como modal del Portal Residente.
 *
 * Es la antigua vista `pages/registro-vehiculo` trasladada a un diálogo:
 * conserva la tarjeta "Información del Vehículo", sus cinco campos, el
 * indicador de color y la botonera Cancelar / Registrar Vehículo.
 *
 * El contenedor (`PortalResidente`) decide cuándo abrirlo con `[open]` y
 * recibe `(cerrado)` cuando el residente cancela o cierra.
 */
@Component({
  selector: 'app-modal-registro-vehiculo',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './modal-registro-vehiculo.html',
  styleUrl: './modal-registro-vehiculo.scss',
})
export class ModalRegistroVehiculoComponent {

  @Input() open = false;
  @Output() cerrado = new EventEmitter<void>();

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

  /** Cierra el modal (botón "Cancelar" del formulario). */
  onCancel(): void {
    this.cerrado.emit();
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
