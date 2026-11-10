import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

interface Inquilino {
  nombre: string;
  unidad: string;
  idUnidad: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-gestionar-inquilinos',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './gestionar-inquilinos.component.html',
  styleUrls: ['./gestionar-inquilinos.component.scss']
})
export class GestionarInquilinosComponent {
  inquilinos: Inquilino[] = [
    { nombre: 'Carlos Rodríguez', unidad: 'Torre A - 402', idUnidad: 'PR-A402', email: 'carlos.r@email.com', telefono: '+52 555-123-4567', estado: 'Activo' },
    { nombre: 'Elena Martínez', unidad: 'Torre B - 105', idUnidad: 'PR-B105', email: 'elena.m@email.com', telefono: '+52 555-987-6543', estado: 'Activo' },
    { nombre: 'Ricardo Silva', unidad: 'Torre A - 201', idUnidad: 'PR-A201', email: 'ricardo.s@email.com', telefono: '+52 555-456-7890', estado: 'Inactivo' },
    { nombre: 'Sofía Vega', unidad: 'Torre C - 303', idUnidad: 'PR-C303', email: 'sofia.v@email.com', telefono: '+52 555-000-1122', estado: 'Activo' },
  ];
}
