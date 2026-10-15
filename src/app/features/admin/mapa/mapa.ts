import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes compartidos reutilizables
import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { ButtonComponent } from '@shared/components/button/button';

export type SlotStatus = 'LIBRE' | 'OCUPADO' | 'ASIGNADO';
export type VehicleType = 'CARRO' | 'MOTO';

export interface ParkingSlot {
  id: string;
  numero: string;
  tipo: VehicleType;
  estado: SlotStatus;
  placa?: string;
}

export interface OcupacionSummary {
  ocupadosCarros: number;
  totalCarros: number;
  ocupadosMotos: number;
  totalMotos: number;
  proximasSalidas: number;
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ButtonComponent
  ],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss']
})
export class MapaComponent implements OnInit {
  searchPlaca: string = '';
  isLoading: boolean = false;

  // Estado de Paginación Zona Carros
  currentCarPage: number = 1;
  totalCarPages: number = 9;

  // Estado de Paginación Zona Motos
  currentMotoPage: number = 1;
  totalMotoPages: number = 16;

  // Métricas
  summary: OcupacionSummary = {
    ocupadosCarros: 42,
    totalCarros: 150,
    ocupadosMotos: 60,
    totalMotos: 450,
    proximasSalidas: 8
  };

  // Celdas visibles en pantalla
  carSlots: ParkingSlot[] = [];
  motoSlots: ParkingSlot[] = [];

  ngOnInit(): void {
    this.updateCarSlots();
    this.updateMotoSlots();
  }

  // --- Navegación Zona Carros ---
  prevCarPage(): void {
    if (this.currentCarPage > 1) {
      this.currentCarPage--;
      this.updateCarSlots();
    }
  }

  nextCarPage(): void {
    if (this.currentCarPage < this.totalCarPages) {
      this.currentCarPage++;
      this.updateCarSlots();
    }
  }

  updateCarSlots(): void {
    const offset = (this.currentCarPage - 1) * 18;
    const states: SlotStatus[] = ['OCUPADO', 'LIBRE', 'ASIGNADO'];
    const samplePlates = ['ABC-123', 'XYZ-987', 'VIP-001', 'JKL-456', 'QWE-456', 'RTY-789', 'ZXC-111'];

    this.carSlots = Array.from({ length: 18 }, (_, index) => {
      const slotNumber = offset + index + 1;
      const estado = states[(slotNumber + this.currentCarPage) % 3];
      const placa = estado !== 'LIBRE' ? samplePlates[(slotNumber * 2) % samplePlates.length] : undefined;

      return {
        id: `c_${slotNumber}`,
        numero: `${slotNumber}`,
        tipo: 'CARRO',
        estado,
        placa
      };
    });
  }

  // --- Navegación Zona Motos ---
  prevMotoPage(): void {
    if (this.currentMotoPage > 1) {
      this.currentMotoPage--;
      this.updateMotoSlots();
    }
  }

  nextMotoPage(): void {
    if (this.currentMotoPage < this.totalMotoPages) {
      this.currentMotoPage++;
      this.updateMotoSlots();
    }
  }

  updateMotoSlots(): void {
    const offset = (this.currentMotoPage - 1) * 28;
    const states: SlotStatus[] = ['OCUPADO', 'LIBRE', 'ASIGNADO'];

    this.motoSlots = Array.from({ length: 28 }, (_, index) => {
      const slotNumber = offset + index + 1;
      const estado = states[(slotNumber + this.currentMotoPage) % 3];

      return {
        id: `m_${slotNumber}`,
        numero: `${slotNumber}`,
        tipo: 'MOTO',
        estado
      };
    });
  }

  get libresCarros(): number {
    return this.summary.totalCarros - this.summary.ocupadosCarros;
  }

  get porcentajeCarros(): number {
    return Math.round((this.summary.ocupadosCarros / this.summary.totalCarros) * 100);
  }

  get libresMotos(): number {
    return this.summary.totalMotos - this.summary.ocupadosMotos;
  }

  get porcentajeMotos(): number {
    return Math.round((this.summary.ocupadosMotos / this.summary.totalMotos) * 100);
  }

  nuevoIngreso(): void {
    console.log('Abriendo modal para nuevo ingreso...');
  }

  selectSlot(slot: ParkingSlot): void {
    console.log('Celda seleccionada:', slot);
  }
}
