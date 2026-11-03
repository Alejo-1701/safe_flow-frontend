import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card';
import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-propietario-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, StatCardComponent, CardWidgetComponent, StatusBadgeComponent, Modal, FormsModule],
  templateUrl: './propietario-dashboard.component.html',
  styleUrl: './propietario-dashboard.component.scss'
})
export class PropietarioDashboardComponent {
  constructor(public router: Router, private cdr: ChangeDetectorRef) {}

  userName = 'Ricardo Sosa';
  primerNombre = '';
  segundoNombre = '';
  primerApellido = '';
  segundoApellido = '';
  showUpdateModal = false;
  showSuccessModal = false;

  // Función auxiliar para capitalizar
  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  abrirModalActualizacion() {
    // Dividimos "Ricardo Sosa" en partes para el prototipo
    const partes = this.userName.split(' ');
    this.primerNombre = this.capitalize(partes[0] || '');
    this.primerApellido = this.capitalize(partes[1] || '');
    this.segundoNombre = '';
    this.segundoApellido = '';
    this.showUpdateModal = true;
  }

  cerrarModalActualizacion() {
    this.showUpdateModal = false;
  }

  guardarDatos() {
    console.log('--- Botón presionado ---');
    // Capitalizar los valores antes de guardar
    this.primerNombre = this.capitalize(this.primerNombre);
    this.segundoNombre = this.capitalize(this.segundoNombre);
    this.primerApellido = this.capitalize(this.primerApellido);
    this.segundoApellido = this.capitalize(this.segundoApellido);

    this.userName = `${this.primerNombre} ${this.primerApellido}`.trim();
    console.log('Nombre actualizado a:', this.userName);
    this.showUpdateModal = false;
    this.showSuccessModal = true;
    
    // Forzar detección de cambios manualmente
    this.cdr.detectChanges();
  }

  cerrarModalExito() {
    this.showSuccessModal = false;
  }

  // Datos simulados para el prototipo
  // Se muestran solo los 2 primeros en el dashboard
  propiedades = [
    { id: 'PR-A402', nombre: 'Torre A - Apt 402', ocupado: true, residente: 'Familia Gómez' },
    { id: 'PR-B105', nombre: 'Torre B - Apt 105', ocupado: true, residente: 'Familia Martínez' }
  ];
  
  // Todos los residentes para la gestión
  residentes = [
    { nombre: 'Carlos Gómez', rol: 'Residente Principal', apt: 'A402' },
    { nombre: 'Elena Martínez', rol: 'Residente Principal', apt: 'B105' },
    { nombre: 'Ricardo Silva', rol: 'Pendiente de asignar', apt: null },
    { nombre: 'Sofía Vega', rol: 'Pendiente de asignar', apt: null }
  ];

  onAdministrarInquilinos(): void {
    this.router.navigate(['/propietario/gestionar-inquilinos']);
  }
}
