import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldComponent } from '../../../../shared/components/form-field/form-field';

export interface CampoSolicitud {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'tel';
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

/**
 * "Nueva Solicitud de Residente".
 *
 * Contenedor modal del formulario de solicitud de cupo. El markup y los campos
 * los resuelve `form-field` (componente compartido, sin modificar); este
 * componente aporta el encabezado, el banner de política y el pie institucional.
 *
 * Los iconos por campo y los de los botones se inyectan por `::ng-deep` desde
 * el SCSS, que es el patrón que ya usa `features/residente/components/my-requests`
 * sobre `app-card-widget`.
 */
@Component({
  selector: 'app-nueva-solicitud',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './nueva-solicitud.html',
  styleUrls: ['./nueva-solicitud.scss']
})
export class NuevaSolicitudComponent {
  @Input() open = false;

  @Output() cerrado = new EventEmitter<void>();
  @Output() enviada = new EventEmitter<Record<string, unknown>>();

  /**
   * Configuración de los cuatro campos. `form-field` los renderiza en su grid
   * de dos columnas con label, placeholder y validación de obligatoriedad.
   *
   * Nota: el placeholder del select lo fija `form-field` de forma interna
   * ("Seleccione una opción"); no se puede cambiar sin tocar el compartido.
   */
  readonly campos: CampoSolicitud[] = [
    { key: 'placa', label: 'Placa del Vehículo', type: 'text', placeholder: 'Ej: ABC-123', required: true },
    { key: 'marcaModelo', label: 'Marca/Modelo', type: 'text', placeholder: 'Ej: Mazda 3 / 2024', required: true },
    {
      key: 'tipoVehiculo',
      label: 'Tipo de Vehículo',
      type: 'select',
      required: true,
      options: [
        { label: 'Automóvil', value: 'automovil' },
        { label: 'Motocicleta', value: 'motocicleta' },
        { label: 'Bicicleta', value: 'bicicleta' },
        { label: 'Vehículo de servicio', value: 'servicio' }
      ]
    },
    { key: 'fechaInicio', label: 'Fecha de Inicio Deseada', type: 'date', required: true }
  ];

  onSubmit(valor: Record<string, unknown>): void {
    this.enviada.emit(valor);
  }

  onCancel(): void {
    this.cerrado.emit();
  }
}