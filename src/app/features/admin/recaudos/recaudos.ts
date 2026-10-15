import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes compartidos reutilizables
import { SidebarComponent } from '@shared/components/sidebar/sidebar';

export interface RecaudoItem {
  id: number;
  fechaHora: string;
  placa: string;
  tipoVehiculo: 'Carro' | 'Moto' | 'Camioneta';
  tiempo: string;
  valor: string;
  metodoPago: 'Efectivo' | 'Digital';
  guardaNombre: string;
  estado: 'Liquidado' | 'Pendiente';
}

export interface MetricCard {
  titulo: string;
  valor: string;
  variacion: string;
  esPositiva: boolean;
}

@Component({
  selector: 'app-recaudos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './recaudos.html',
  styleUrls: ['./recaudos.scss']
})
export class RecaudosComponent implements OnInit {
  // Filtros de búsqueda
  selectedRangoFecha: string = 'HOY';
  searchGuarda: string = '';

  // Paginación
  currentPage: number = 1;
  totalPages: number = 2;
  totalRecords: number = 42;

  // Métricas superiores (fieles a la captura)
  metrics: MetricCard[] = [
    { titulo: 'Recaudo Total Hoy', valor: '$1,250.00', variacion: '+12.5%', esPositiva: true },
    { titulo: 'Recaudo Semanal', valor: '$1,250.00', variacion: '+5.2%', esPositiva: true },
    { titulo: 'Transacciones del Día', valor: '$1,250.00', variacion: '+8.1%', esPositiva: true },
    { titulo: 'Promedio por Vehículo', valor: '$1,250.00', variacion: '-2.3%', esPositiva: false }
  ];

  // Datos del Arqueo Pendiente
  arqueoPendiente = {
    monto: '$450,200 COP',
    descripcion: 'Existe un cierre de turno de la mañana sin confirmar por el administrador.'
  };

  // Mock de recaudos registrado
  recaudosList: RecaudoItem[] = [
    {
      id: 1,
      fechaHora: '24 Oct, 02:15 PM',
      placa: 'ABC-123',
      tipoVehiculo: 'Carro',
      tiempo: '2h 15m',
      valor: '$4,500',
      metodoPago: 'Efectivo',
      guardaNombre: 'Carlos Rodríguez',
      estado: 'Liquidado'
    },
    {
      id: 2,
      fechaHora: '24 Oct, 01:45 PM',
      placa: 'XYZ-789',
      tipoVehiculo: 'Moto',
      tiempo: '1h 10m',
      valor: '$2,200',
      metodoPago: 'Digital',
      guardaNombre: 'Marta Lucía',
      estado: 'Liquidado'
    },
    {
      id: 3,
      fechaHora: '24 Oct, 12:30 PM',
      placa: 'KLO-456',
      tipoVehiculo: 'Carro',
      tiempo: '4h 50m',
      valor: '$9,000',
      metodoPago: 'Efectivo',
      guardaNombre: 'Carlos Rodríguez',
      estado: 'Liquidado'
    },
    {
      id: 4,
      fechaHora: '24 Oct, 11:15 AM',
      placa: 'ERT-112',
      tipoVehiculo: 'Camioneta',
      tiempo: '0h 45m',
      valor: '$3,100',
      metodoPago: 'Digital',
      guardaNombre: 'Juan Pablo',
      estado: 'Liquidado'
    }
  ];

  ngOnInit(): void {
    this.applyFilters();
  }

  get filteredRecaudos(): RecaudoItem[] {
    return this.recaudosList.filter(item => {
      const matchesGuarda = item.guardaNombre.toLowerCase().includes(this.searchGuarda.toLowerCase()) ||
                            item.placa.toLowerCase().includes(this.searchGuarda.toLowerCase());
      return matchesGuarda;
    });
  }

  // --- Funcionalidad de Botones ---

  exportReport(): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.filteredRecaudos, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `reporte_recaudos_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  clearFilters(): void {
    this.selectedRangoFecha = 'HOY';
    this.searchGuarda = '';
  }

  applyFilters(): void {
    console.log('Filtros aplicados:', { rango: this.selectedRangoFecha, guarda: this.searchGuarda });
  }

  viewArqueo(): void {
    alert(`Iniciando revisión de Arqueo de Caja Pendiente.\nMonto a conciliar: ${this.arqueoPendiente.monto}`);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
