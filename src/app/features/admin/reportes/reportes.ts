import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes compartidos reutilizables
import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { StatCardComponent } from '@shared/components/stat-card/stat-card';
import { ButtonComponent } from '@shared/components/button/button';

export interface Incidencia {
  id: string;
  fecha: string;
  remitenteUbicacion: string;
  remitenteNombre: string;
  asunto: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  categoria: string;
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto';
}

export interface MetricSummary {
  totalReportes: number;
  pendientes: number;
  resueltos: number;
  efectividadPorcentaje: number;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    StatCardComponent,
    ButtonComponent
  ],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss']
})
export class ReportesComponent implements OnInit {
  selectedPrioridad: string = 'TODAS';
  selectedCategoria: string = 'TODAS';

  isLoading: boolean = false;

  // Métricas preparadas para consumir desde servicio backend posteriormente
  metrics: MetricSummary = {
    totalReportes: 1284,
    pendientes: 24,
    resueltos: 1210,
    efectividadPorcentaje: 94.2
  };

  // Mock de datos fiel a la interfaz de diseño
  incidenciasList: Incidencia[] = [
    {
      id: '#INC-4921',
      fecha: '24 Oct, 08:30 AM',
      remitenteUbicacion: 'Torre B - Apto 402',
      remitenteNombre: 'RICARDO GÓMEZ',
      asunto: 'Vehículo extraño en celda asignada pe...',
      prioridad: 'ALTA',
      categoria: 'Parqueadero',
      estado: 'Pendiente'
    },
    {
      id: '#INC-4920',
      fecha: '23 Oct, 14:15 PM',
      remitenteUbicacion: 'Torre A - Apto 101',
      remitenteNombre: 'MARTA LUCÍA',
      asunto: 'Obstrucción de salida por mudanza no ...',
      prioridad: 'MEDIA',
      categoria: 'Convivencia',
      estado: 'En Proceso'
    },
    {
      id: '#INC-4918',
      fecha: '23 Oct, 09:45 AM',
      remitenteUbicacion: 'Visitante V-33',
      remitenteNombre: 'PLACA XYZ-789',
      asunto: 'Derrame de aceite en zona común nive...',
      prioridad: 'BAJA',
      categoria: 'Mantenimiento',
      estado: 'Resuelto'
    }
  ];

  filteredIncidencias: Incidencia[] = [];

  ngOnInit(): void {
    this.loadReportesData();
  }

  loadReportesData(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.applyFilters();
      this.isLoading = false;
    }, 200);
  }

  applyFilters(): void {
    this.filteredIncidencias = this.incidenciasList.filter(item => {
      const matchPrioridad =
        this.selectedPrioridad === 'TODAS' || item.prioridad === this.selectedPrioridad;
      const matchCategoria =
        this.selectedCategoria === 'TODAS' || item.categoria === this.selectedCategoria;

      return matchPrioridad && matchCategoria;
    });
  }

  resetFilters(): void {
    this.selectedPrioridad = 'TODAS';
    this.selectedCategoria = 'TODAS';
    this.applyFilters();
  }

  exportReportes(): void {
    console.log('Exportando reporte de incidencias...');
  }

  gestionarIncidencia(incidencia: Incidencia): void {
    console.log('Gestionando incidencia:', incidencia.id);
  }
}
