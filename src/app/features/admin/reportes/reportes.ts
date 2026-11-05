import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';

export interface IncidenciaItem {
  id: string;
  fecha: string;
  remitente: string;
  torreApto: string;
  asunto: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRÍTICA';
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto';
  observaciones: string[];
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss']
})
export class ReportesComponent implements OnInit {
  // Filtros de búsqueda
  filtroPrioridad: string = 'TODAS';
  filtroCategoria: string = 'TODAS';

  // Paginación real
  currentPage: number = 1;
  pageSize: number = 4; // Número de registros por página

  // Control de Modales y Menús desplegables
  isGestionModalOpen: boolean = false;
  isCitacionModalOpen: boolean = false;
  isActionMenuOpenId: string | null = null;

  selectedIncidencia: IncidenciaItem | null = null;
  nuevaObservacionText: string = '';

  // Formulario para citación por correo
  citacionForm = {
    asunto: '',
    fechaCita: '',
    horaCita: '',
    mensaje: ''
  };

  // Base de datos maestra con múltiples registros reales
  masterIncidencias: IncidenciaItem[] = [
    {
      id: '#INC-4921',
      fecha: '24 Oct, 08:30 AM',
      remitente: 'RICARDO GÓMEZ',
      torreApto: 'Torre B - Apto 402',
      asunto: 'Vehículo extraño en celda asignada privativamente sin autorización.',
      prioridad: 'ALTA',
      estado: 'Pendiente',
      observaciones: ['Reportado por el residente titular.', 'Pendiente revisión de bitácora de portería.']
    },
    {
      id: '#INC-4920',
      fecha: '23 Oct, 14:15 PM',
      remitente: 'MARTA LUCÍA',
      torreApto: 'Torre A - Apto 101',
      asunto: 'Obstrucción de salida por mudanza no programada en zona común.',
      prioridad: 'MEDIA',
      estado: 'En Proceso',
      observaciones: ['Guarda de turno se comunicó con la empresa de mudanzas.']
    },
    {
      id: '#INC-4918',
      fecha: '23 Oct, 09:45 AM',
      remitente: 'PLACA XYZ-789',
      torreApto: 'Visitante V-33',
      asunto: 'Derrame de aceite en zona común nivel -1 de parqueaderos.',
      prioridad: 'BAJA',
      estado: 'Resuelto',
      observaciones: ['Personal de aseo aplicó material absorbente y arena.', 'Zona limpia y habilitada.']
    },
    {
      id: '#INC-4915',
      fecha: '22 Oct, 18:20 PM',
      remitente: 'CAMILO ANDRÉS',
      torreApto: 'Torre 3 - 201',
      asunto: 'Control remoto de talanquera vehicular averiado.',
      prioridad: 'MEDIA',
      estado: 'Resuelto',
      observaciones: ['Se reemplazó la batería del dispositivo.', 'Probado exitosamente.']
    },
    {
      id: '#INC-4912',
      fecha: '21 Oct, 07:10 AM',
      remitente: 'SANDRA MILENA',
      torreApto: 'Torre 5 - 1102',
      asunto: 'Invasión de carril peatonal por motocicleta de delivery.',
      prioridad: 'ALTA',
      estado: 'Pendiente',
      observaciones: ['Se solicitó registro de cámaras de seguridad a administración.']
    }
  ];

  ngOnInit(): void {}

  // --- Métricas Calculadas del Dashboard Superior ---
  get totalReportesCount(): number {
    return this.masterIncidencias.length;
  }

  get pendientesCount(): number {
    return this.masterIncidencias.filter(i => i.estado === 'Pendiente' || i.estado === 'En Proceso').length;
  }

  get resueltosCount(): number {
    return this.masterIncidencias.filter(i => i.estado === 'Resuelto').length;
  }

  // --- Filtrado Dinámico ---
  get filteredIncidencias(): IncidenciaItem[] {
    return this.masterIncidencias.filter(item => {
      const matchPrioridad = this.filtroPrioridad === 'TODAS' || item.prioridad === this.filtroPrioridad;
      return matchPrioridad;
    });
  }

  // --- Paginación Real ---
  get totalPages(): number {
    return Math.ceil(this.filteredIncidencias.length / this.pageSize) || 1;
  }

  get paginatedIncidencias(): IncidenciaItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredIncidencias.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  aplicarFiltros(): void {
    this.currentPage = 1; // Reiniciamos a la página 1 al filtrar
  }

  limpiarFiltros(): void {
    this.filtroPrioridad = 'TODAS';
    this.filtroCategoria = 'TODAS';
    this.currentPage = 1;
  }

  // --- Menú de Acciones (Gestionar) ---
  toggleActionMenu(id: string, event: Event): void {
    event.stopPropagation();
    this.isActionMenuOpenId = this.isActionMenuOpenId === id ? null : id;
  }

  closeActionMenu(): void {
    this.isActionMenuOpenId = null;
  }

  // --- Modal de Gestión Integral ---
  openGestionModal(incidencia: IncidenciaItem): void {
    this.selectedIncidencia = incidencia;
    this.nuevaObservacionText = '';
    this.isGestionModalOpen = true;
    this.closeActionMenu();
  }

  closeGestionModal(): void {
    this.isGestionModalOpen = false;
    this.selectedIncidencia = null;
  }

  agregarObservacion(): void {
    if (!this.nuevaObservacionText.trim() || !this.selectedIncidencia) return;
    this.selectedIncidencia.observaciones.push(this.nuevaObservacionText.trim());
    this.nuevaObservacionText = '';
    alert('Observación agregada exitosamente a la bitácora.');
  }

  eliminarObservacion(index: number): void {
    if (this.selectedIncidencia && confirm('¿Desea eliminar esta observación del registro?')) {
      this.selectedIncidencia.observaciones.splice(index, 1);
    }
  }

  cambiarEstado(nuevoEstado: 'Pendiente' | 'En Proceso' | 'Resuelto'): void {
    if (this.selectedIncidencia) {
      this.selectedIncidencia.estado = nuevoEstado;
      alert(`Estado de la incidencia actualizado a: ${nuevoEstado}`);
      this.closeActionMenu();
    }
  }

  // --- Citación a Administración por Correo ---
  openCitacionModal(incidencia: IncidenciaItem): void {
    this.selectedIncidencia = incidencia;
    this.citacionForm = {
      asunto: `Citación Formal por Incidencia ${incidencia.id} - Safe Flow`,
      fechaCita: '',
      horaCita: '',
      mensaje: `Estimado/a ${incidencia.remitente} (${incidencia.torreApto}), se le convoca a la administración para dar solución al reporte presentado.`
    };
    this.isCitacionModalOpen = true;
    this.closeActionMenu();
  }

  closeCitacionModal(): void {
    this.isCitacionModalOpen = false;
  }

  enviarCitacionCorreo(): void {
    if (!this.citacionForm.fechaCita || !this.citacionForm.horaCita) {
      alert('Por favor complete la fecha y hora de la citación.');
      return;
    }

    alert(`¡Citación enviada por correo a ${this.selectedIncidencia?.remitente} exitosamente!`);
    if (this.selectedIncidencia) {
      this.selectedIncidencia.observaciones.push(`Citación por correo programada para el ${this.citacionForm.fechaCita} a las ${this.citacionForm.horaCita}.`);
    }
    this.closeCitacionModal();
  }

  // --- Contactar Residente ---
  contactarPorTelefono(incidencia: IncidenciaItem): void {
    alert(`Iniciando comunicación telefónica con ${incidencia.remitente} (${incidencia.torreApto})...`);
    this.closeActionMenu();
  }

  // --- Exportar Reportes a Archivo CSV ---
  exportarExcel(): void {
    if (this.masterIncidencias.length === 0) {
      alert('No hay registros para exportar.');
      return;
    }

    let csvContent = '\uFEFFID REPORTE,FECHA,REMITENTE,TORRE/APTO,ASUNTO,PRIORIDAD,ESTADO\n';
    this.masterIncidencias.forEach(item => {
      csvContent += `"${item.id}","${item.fecha}","${item.remitente}","${item.torreApto}","${item.asunto}","${item.prioridad}","${item.estado}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Reportes_Incidencias_SafeFlow.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
