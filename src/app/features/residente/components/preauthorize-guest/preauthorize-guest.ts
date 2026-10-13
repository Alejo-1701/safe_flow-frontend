import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldComponent, FieldConfig } from '../../../../shared/components/form-field/form-field';

@Component({
  selector: 'app-preauthorize-guest',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './preauthorize-guest.html',
  styleUrl: './preauthorize-guest.scss',
})
export class PreauthorizeGuestComponent {
  fields: FieldConfig[] = [
    {
      key: 'guestName',
      label: 'Nombre del Invitado',
      type: 'text',
      placeholder: 'Ej. Carlos Mendoza',
      required: true
    },
    {
      key: 'vehiclePlate',
      label: 'Placa del Vehículo (Opcional)',
      type: 'text',
      placeholder: 'XXX-000',
      required: false
    },
    {
      key: 'entryDate',
      label: 'Fecha de Ingreso',
      type: 'date',
      required: true
    }
  ];

  onGenerateAuthorization(_payload: unknown): void {
    // TODO: enviar la pre-autorización al servicio correspondiente.
    // TODO: refrescar el listado de visitas al finalizar.
  }
}
