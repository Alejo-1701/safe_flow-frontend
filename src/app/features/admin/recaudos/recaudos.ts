import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { StatCardComponent } from '@shared/components/stat-card/stat-card';

export interface RecaudoItem {
  id: number;
  fechaHora: string;
  fechaObj: Date; // Para filtrado real por fechas
  placa: string;
  tipo: string;
  tiempo: string;
  valor: number; // Numérico para cálculos y exportación
  valorFormateado: string;
  metodoPago: string;
  guarda: string;
  estado: string;
}

@Component({
  selector: 'app-recaudos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    StatCardComponent
  ],
  templateUrl: './recaudos.html',
  styleUrls: ['./recaudos.scss']
})
export class RecaudosComponent implements OnInit {
  // Filtros de búsqueda
  searchGuarda: string = '';
  selectedRango: string = 'TODOS';

  // Paginación comercial
  currentPage: number = 1;
  pageSize: number = 4;

  // Modales
  isArqueoModalOpen: boolean = false;
  arqueoConciliado: boolean = false;

  // Lista maestra de recaudos (simulando Base de Datos)
  masterRecaudos: RecaudoItem[] = [
    { id: 1, fechaHora: '24 Oct, 02:15 PM', fechaObj: new Date('2026-10-24T14:15:00'), placa: 'ABC-123', tipo: 'Carro', tiempo: '2h 15m', valor: 4500, valorFormateado: '$4,500', metodoPago: 'Efectivo', guarda: 'Carlos Rodríguez', estado: 'Liquidado' },
    { id: 2, fechaHora: '24 Oct, 01:45 PM', fechaObj: new Date('2026-10-24T13:45:00'), placa: 'XYZ-789', tipo: 'Moto', tiempo: '1h 10m', valor: 2200, valorFormateado: '$2,200', metodoPago: 'Digital', guarda: 'Marta Lucía', estado: 'Liquidado' },
    { id: 3, fechaHora: '24 Oct, 12:30 PM', fechaObj: new Date('2026-10-24T12:30:00'), placa: 'KLO-456', tipo: 'Carro', tiempo: '4h 50m', valor: 9000, valorFormateado: '$9,000', metodoPago: 'Efectivo', guarda: 'Carlos Rodríguez', estado: 'Liquidado' },
    { id: 4, fechaHora: '24 Oct, 11:15 AM', fechaObj: new Date('2026-10-24T11:15:00'), placa: 'ERT-112', tipo: 'Camioneta', tiempo: '0h 45m', valor: 3100, valorFormateado: '$3,100', metodoPago: 'Digital', guarda: 'Juan Pablo', estado: 'Liquidado' },
    { id: 5, fechaHora: '23 Oct, 05:20 PM', fechaObj: new Date('2026-10-23T17:20:00'), placa: 'MNO-333', tipo: 'Carro', tiempo: '3h 00m', valor: 6000, valorFormateado: '$6,000', metodoPago: 'Efectivo', guarda: 'Marta Lucía', estado: 'Liquidado' },
    { id: 6, fechaHora: '23 Oct, 02:10 PM', fechaObj: new Date('2026-10-23T14:10:00'), placa: 'JYT-888', tipo: 'Moto', tiempo: '1h 30m', valor: 2500, valorFormateado: '$2,500', metodoPago: 'Digital', guarda: 'Juan Pablo', estado: 'Liquidado' }
  ];

  ngOnInit(): void {}

  // --- Lógica de Filtrado Dinámico Real ---
  get filteredRecaudos(): RecaudoItem[] {
    return this.masterRecaudos.filter(item => {
      const matchGuarda = item.guarda.toLowerCase().includes(this.searchGuarda.toLowerCase()) ||
                          item.placa.toLowerCase().includes(this.searchGuarda.toLowerCase()) ||
                          item.tipo.toLowerCase().includes(this.searchGuarda.toLowerCase());

      // Filtro por rango de fechas simulado
      let matchFecha = true;
      const now = new Date('2026-10-24T16:00:00'); // Fecha de referencia mock actual
      if (this.selectedRango === 'HOY') {
        matchFecha = item.fechaObj.toDateString() === now.toDateString();
      } else if (this.selectedRango === 'SEMANA') {
        const diffTime = Math.abs(now.getTime() - item.fechaObj.getTime());
        const diffDays = diffTime / (1000 * 3600 * 24);
        matchFecha = diffDays <= 7;
      }

      return matchGuarda && matchFecha;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRecaudos.length / this.pageSize) || 1;
  }

  get paginatedRecaudos(): RecaudoItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecaudos.slice(startIndex, startIndex + this.pageSize);
  }

  get paginationText(): string {
    const total = this.filteredRecaudos.length;
    if (total === 0) return 'Mostrando 0 recaudos';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, total);
    return `Mostrando ${start}-${end} de ${total} recaudos`;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  limpiarFiltros(): void {
    this.searchGuarda = '';
    this.selectedRango = 'TODOS';
    this.currentPage = 1;
  }

  // --- Exportar a Excel (CSV Profesional) ---
  exportarExcel(dataToExport: RecaudoItem[] = this.filteredRecaudos, filename: string = 'Reporte_Recaudos_SafeFlow.csv'): void {
    if (dataToExport.length === 0) {
      alert('No hay datos disponibles para exportar con los filtros actuales.');
      return;
    }

    let csvContent = '\uFEFFFECHA/HORA,PLACA,TIPO,TIEMPO,VALOR,MÉTODO DE PAGO,GUARDA,ESTADO\n';
    dataToExport.forEach(item => {
      csvContent += `"${item.fechaHora}","${item.placa}","${item.tipo}","${item.tiempo}","${item.valorFormateado}","${item.metodoPago}","${item.guarda}","${item.estado}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Modal Arqueo de Caja ---
  openArqueoModal(): void {
    this.isArqueoModalOpen = true;
  }

  closeArqueoModal(): void {
    this.isArqueoModalOpen = false;
  }

  conciliarArqueo(): void {
    this.arqueoConciliado = true;
    alert('Arqueo de caja conciliado y confirmado con éxito por el administrador.');
    this.closeArqueoModal();
  }

  exportarArqueoExcel(): void {
    // Exportar transacciones asociadas al arqueo de caja pendiente
    this.exportarExcel(this.masterRecaudos, 'Arqueo_Caja_Manana.csv');
  }
}
