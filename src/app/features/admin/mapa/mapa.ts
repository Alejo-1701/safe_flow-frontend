import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { StatCardComponent } from '@shared/components/stat-card/stat-card';

export type SlotStatus = 'libre' | 'ocupado' | 'asignado';
export type VehicleType = 'CARRO' | 'MOTO';

export interface VehiculoInfo {
  placa: string;
  tipo: string;
  linea: string;
  modelo: number;
  color: string;
  propietarioNombre: string;
  propietarioDocumento: string;
  telefono: string;
  unidad: string;
}

export interface ParkingSlot {
  id: string;
  numero: string;
  tipo: VehicleType;
  estado: SlotStatus;
  vehiculo?: VehiculoInfo;
}

export interface SolicitudItem {
  id: number;
  residenteNombre: string;
  documento: string;
  placaVehiculo: string;
  tipoVehiculo: 'CARRO' | 'MOTO';
  descripcion: string;
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    StatCardComponent
  ],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss']
})
export class MapaComponent implements OnInit {
  searchQuery: string = '';
  viewFilter: 'TODOS' | 'CARROS' | 'MOTOS' = 'TODOS';

  isDetailModalOpen: boolean = false;
  isNewEntryModalOpen: boolean = false;
  selectedSpace: ParkingSlot | null = null;

  newEntryForm = {
    placa: '',
    tipo: 'CARRO' as VehicleType,
    celdaAsignada: '',
    estadoInicial: 'ocupado' as SlotStatus,
    linea: 'Particular',
    modelo: 2023,
    color: 'Negro',
    propietarioNombre: 'Nuevo Residente',
    telefono: '3001234567',
    unidad: 'Torre 1 - 101',
    observaciones: ''
  };

  pendingRequests: SolicitudItem[] = [
    { id: 1, residenteNombre: 'Carlos Rodríguez', documento: '1020304050', placaVehiculo: 'ABC123', tipoVehiculo: 'CARRO', descripcion: 'Solicitud de celda fija Torre 1 - 402' },
    { id: 2, residenteNombre: 'Marta Lucía Gomez', documento: '1098765432', placaVehiculo: 'MTO999', tipoVehiculo: 'MOTO', descripcion: 'Solicitud parqueadero moto Torre 3 - 101' }
  ];
  selectedRequestId: number | null = null;

  pageSize: number = 8;
  currentCarPage: number = 1;
  totalCarPages: number = Math.ceil(100 / 8);
  currentMotoPage: number = 1;
  totalMotoPages: number = Math.ceil(150 / 8);

  carSlots: ParkingSlot[] = [];
  motoSlots: ParkingSlot[] = [];

  masterCarSlots: ParkingSlot[] = [];
  masterMotoSlots: ParkingSlot[] = [];

  ngOnInit(): void {
    this.initializeMasterSpaces();
    this.updateCarSlots();
    this.updateMotoSlots();
  }

  // Método para asegurar mayúsculas y máximo 6 caracteres en tiempo real
  onPlacaInput(event: any): void {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 6) {
      value = value.substring(0, 6);
    }
    this.newEntryForm.placa = value;
  }

  initializeMasterSpaces(): void {
    for (let i = 1; i <= 100; i++) {
      let estado: SlotStatus = 'libre';
      let vehiculo = undefined;

      if (i === 1) {
        estado = 'ocupado';
        vehiculo = { placa: 'VIP001', tipo: 'Automóvil', linea: 'Mazda 3', modelo: 2023, color: 'Negro', propietarioNombre: 'Juan Delgado', propietarioDocumento: '1020304050', telefono: '3001234567', unidad: 'Torre A - 402' };
      } else if (i === 2) {
        estado = 'asignado';
        vehiculo = { placa: 'QWE456', tipo: 'Camioneta', linea: 'Renault Duster', modelo: 2022, color: 'Gris', propietarioNombre: 'Maria Peña', propietarioDocumento: '1098765432', telefono: '3129876543', unidad: 'Torre B - 105' };
      } else if (i === 3) {
        estado = 'asignado';
        vehiculo = { placa: 'ABC123', tipo: 'Automóvil', linea: 'Chevrolet Sail', modelo: 2020, color: 'Blanco', propietarioNombre: 'Carlos Rodríguez', propietarioDocumento: '1020304050', telefono: '3101234567', unidad: 'Torre 1 - 402' };
      } else if (i === 4) {
        estado = 'ocupado';
        vehiculo = { placa: 'XYZ987', tipo: 'Automóvil', linea: 'Kia Picanto', modelo: 2021, color: 'Rojo', propietarioNombre: 'Ricardo Costa', propietarioDocumento: '1122334455', telefono: '3151112233', unidad: 'Torre A - 201' };
      } else if (i === 5) {
        estado = 'asignado';
        vehiculo = { placa: 'JKL456', tipo: 'Automóvil', linea: 'Toyota Corolla', modelo: 2024, color: 'Azul', propietarioNombre: 'Laura Gómez', propietarioDocumento: '1050607080', telefono: '3105556677', unidad: 'Torre C - 304' };
      }

      this.masterCarSlots.push({ id: `C-${i}`, numero: `${i}`, tipo: 'CARRO', estado, vehiculo });
    }

    for (let i = 1; i <= 150; i++) {
      let estado: SlotStatus = 'libre';
      let vehiculo = undefined;

      if (i === 1) {
        estado = 'ocupado';
        vehiculo = { placa: 'MTO111', tipo: 'Motocicleta', linea: 'Yamaha FZ', modelo: 2023, color: 'Azul', propietarioNombre: 'Andrés Morales', propietarioDocumento: '1088997766', telefono: '3189998877', unidad: 'Torre A - 101' };
      } else if (i === 2) {
        estado = 'asignado';
        vehiculo = { placa: 'MTO222', tipo: 'Motocicleta', linea: 'Bajaj Pulsar', modelo: 2022, color: 'Negro', propietarioNombre: 'Ana Torres', propietarioDocumento: '1044556677', telefono: '3204445566', unidad: 'Torre C - 601' };
      } else if (i === 6) {
        estado = 'asignado';
        vehiculo = { placa: 'MTO333', tipo: 'Motocicleta', linea: 'Suzuki Gixxer', modelo: 2024, color: 'Gris', propietarioNombre: 'Felipe Rojas', propietarioDocumento: '1099887766', telefono: '3112223344', unidad: 'Torre B - 302' };
      } else if (i === 10) {
        estado = 'ocupado';
        vehiculo = { placa: 'MTO444', tipo: 'Motocicleta', linea: 'Honda CB', modelo: 2021, color: 'Rojo', propietarioNombre: 'Sofía Castro', propietarioDocumento: '1033221144', telefono: '3145556677', unidad: 'Torre C - 405' };
      }

      this.masterMotoSlots.push({ id: `M-${i}`, numero: `${i}`, tipo: 'MOTO', estado, vehiculo });
    }
  }

  get totalCarrosOcupadosAsignados(): number {
    return this.masterCarSlots.filter(s => s.estado !== 'libre').length;
  }

  get porcentajeCarros(): number {
    return Math.round((this.totalCarrosOcupadosAsignados / 100) * 100);
  }

  get totalMotosOcupadasAsignadas(): number {
    return this.masterMotoSlots.filter(s => s.estado !== 'libre').length;
  }

  get porcentajeMotos(): number {
    return Math.round((this.totalMotosOcupadasAsignadas / 150) * 100);
  }

  setFilter(filter: 'TODOS' | 'CARROS' | 'MOTOS'): void {
    this.viewFilter = filter;
  }

  updateCarSlots(): void {
    const offset = (this.currentCarPage - 1) * this.pageSize;
    this.carSlots = this.masterCarSlots.slice(offset, offset + this.pageSize);
  }

  prevCarPage(): void {
    if (this.currentCarPage > 1) { this.currentCarPage--; this.updateCarSlots(); }
  }

  nextCarPage(): void {
    if (this.currentCarPage < this.totalCarPages) { this.currentCarPage++; this.updateCarSlots(); }
  }

  updateMotoSlots(): void {
    const offset = (this.currentMotoPage - 1) * this.pageSize;
    this.motoSlots = this.masterMotoSlots.slice(offset, offset + this.pageSize);
  }

  prevMotoPage(): void {
    if (this.currentMotoPage > 1) { this.currentMotoPage--; this.updateMotoSlots(); }
  }

  nextMotoPage(): void {
    if (this.currentMotoPage < this.totalMotoPages) { this.currentMotoPage++; this.updateMotoSlots(); }
  }

  onSpaceClick(space: ParkingSlot): void {
    if (space.estado === 'libre') {
      this.newEntryForm.celdaAsignada = space.numero;
      this.newEntryForm.tipo = space.tipo;
      this.isNewEntryModalOpen = true;
    } else if (space.vehiculo) {
      this.selectedSpace = space;
      this.isDetailModalOpen = true;
    }
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedSpace = null;
  }

  openNewEntryModal(): void {
    this.selectedRequestId = null;
    this.newEntryForm = {
      placa: '',
      tipo: 'CARRO',
      celdaAsignada: '',
      estadoInicial: 'ocupado',
      linea: 'Particular',
      modelo: 2023,
      color: 'Negro',
      propietarioNombre: 'Nuevo Residente',
      telefono: '3001234567',
      unidad: 'Torre 1 - 101',
      observaciones: ''
    };
    this.isNewEntryModalOpen = true;
  }

  closeNewEntryModal(): void {
    this.isNewEntryModalOpen = false;
  }

  onRequestSelect(): void {
    const req = this.pendingRequests.find(r => r.id === Number(this.selectedRequestId));
    if (req) {
      this.newEntryForm.placa = req.placaVehiculo.toUpperCase();
      this.newEntryForm.tipo = req.tipoVehiculo;
      this.newEntryForm.propietarioNombre = req.residenteNombre;
      this.newEntryForm.observaciones = `Asignado desde Solicitud #${req.id}`;
    }
  }

  submitNewEntry(): void {
    if (!this.newEntryForm.placa || !this.newEntryForm.celdaAsignada) {
      alert('Por favor ingrese la placa y el número de celda.');
      return;
    }

    if (this.newEntryForm.placa.length > 6) {
      alert('La placa no puede tener más de 6 caracteres.');
      return;
    }

    const numInput = this.newEntryForm.celdaAsignada.trim().replace(/[^0-9]/g, '');
    const isMoto = this.newEntryForm.tipo === 'MOTO';
    const list = isMoto ? this.masterMotoSlots : this.masterCarSlots;

    const found = list.find(s => s.numero === numInput);
    if (!found) {
      alert(`La celda número ${numInput} no existe en la zona de ${isMoto ? 'Motos' : 'Carros'}.`);
      return;
    }

    found.estado = this.newEntryForm.estadoInicial;
    found.vehiculo = {
      placa: this.newEntryForm.placa.toUpperCase(),
      tipo: isMoto ? 'Motocicleta' : 'Automóvil',
      linea: this.newEntryForm.linea,
      modelo: Number(this.newEntryForm.modelo),
      color: this.newEntryForm.color,
      propietarioNombre: this.newEntryForm.propietarioNombre,
      propietarioDocumento: '1000000000',
      telefono: this.newEntryForm.telefono,
      unidad: this.newEntryForm.unidad
    };

    this.updateCarSlots();
    this.updateMotoSlots();

    alert(`Vehículo ${found.vehiculo.placa} asignado a la celda #${found.numero} con éxito.`);
    this.closeNewEntryModal();
  }
}
