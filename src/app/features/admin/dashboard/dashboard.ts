import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importación de componentes compartidos usando el alias @shared
import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { ButtonComponent } from '@shared/components/button/button';
import { StatCardComponent } from '@shared/components/stat-card/stat-card';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge';

interface ActivityItem {
  placa: string;
  tipo: 'RESIDENTE' | 'VISITANTE';
  horaEntrada: string;
}

interface UserAccessItem {
  unidad: string;
  estado: 'ACTIVO' | 'INACTIVO';
  ultimoAcceso: string;
  residenteNombre: string;
  residenteEmail: string;
  residenteIniciales: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ButtonComponent,
    StatCardComponent,
    StatusBadgeComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  searchTerm: string = '';

  metrics = {
    ocupacion: '85%',
    recaudo: '$ 1,250.00',
    alertas: '3',
    visitantes: '85'
  };

  recentActivity: ActivityItem[] = [
    { placa: 'KJH-452', tipo: 'RESIDENTE', horaEntrada: '14:45 PM' },
    { placa: 'XYZ-908', tipo: 'VISITANTE', horaEntrada: '14:32 PM' },
    { placa: 'ABC-123', tipo: 'RESIDENTE', horaEntrada: '14:15 PM' },
    { placa: 'LMN-774', tipo: 'RESIDENTE', horaEntrada: '13:58 PM' },
    { placa: 'GFT-332', tipo: 'VISITANTE', horaEntrada: '13:45 PM' },
    { placa: 'PLO-229', tipo: 'RESIDENTE', horaEntrada: '13:20 PM' }
  ];

  usersList: UserAccessItem[] = [
    {
      unidad: 'Torre A - 402',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 08:45 AM',
      residenteNombre: 'Juan Delgado',
      residenteEmail: 'j.delgado@email.com',
      residenteIniciales: 'JD'
    },
    {
      unidad: 'Torre B - 105',
      estado: 'ACTIVO',
      ultimoAcceso: 'Ayer, 06:12 PM',
      residenteNombre: 'Maria Peña',
      residenteEmail: 'm.pena@email.com',
      residenteIniciales: 'MP'
    },
    {
      unidad: 'Torre A - 201',
      estado: 'INACTIVO',
      ultimoAcceso: '15 Oct, 2023',
      residenteNombre: 'Ricardo Costa',
      residenteEmail: 'r.costa@email.com',
      residenteIniciales: 'RC'
    }
  ];

  exportData(): void {
    console.log('Exportando datos del dashboard...');
  }

  registerResident(): void {
    console.log('Abriendo modal para registrar residente...');
  }

  viewAllHistory(): void {
    console.log('Navegando al historial completo...');
  }
}
