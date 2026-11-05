import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SlotStatus = 'libre' | 'ocupado' | 'asignado';
export type VehicleType = 'CARRO' | 'MOTO';

export interface ParkingSlot {
  id: string;
  numero: string;
  tipo: VehicleType;
  estado: SlotStatus;
  vehiculo?: any;
}

export interface SolicitudItem {
  id: number;
  posicion: number;
  residenteNombre: string;
  documento: string;
  telefono: string;
  torreApto: string;
  tipoVehiculo: 'Automóvil' | 'Motocicleta' | 'Camioneta';
  categoriaEspacio: 'CARRO' | 'MOTO';
  marcaVehiculo: string;
  placaVehiculo: string;
  fechaSolicitud: string;
  estado: 'PENDIENTE' | 'EN ESPERA' | 'APROBADA';
}

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  // Almacenamiento privado
  private cars: ParkingSlot[] = [];
  private motos: ParkingSlot[] = [];
  private solicitudes: SolicitudItem[] = [
    { id: 1, posicion: 1, residenteNombre: 'Carlos Rodríguez', documento: '1020304050', telefono: '3101234567', torreApto: 'Torre 4 - 502', tipoVehiculo: 'Automóvil', categoriaEspacio: 'CARRO', marcaVehiculo: 'BMW X3', placaVehiculo: 'KLS-482', fechaSolicitud: '12 Oct, 2023', estado: 'PENDIENTE' },
    { id: 2, posicion: 2, residenteNombre: 'Marta Gómez', documento: '1098765432', telefono: '3129876543', torreApto: 'Torre 1 - 203', tipoVehiculo: 'Motocicleta', categoriaEspacio: 'MOTO', marcaVehiculo: 'Yamaha FZ', placaVehiculo: 'MTO-999', fechaSolicitud: '15 Oct, 2023', estado: 'EN ESPERA' },
    { id: 3, posicion: 3, residenteNombre: 'Jorge Martínez', documento: '1122334455', telefono: '3151112233', torreApto: 'Torre 6 - 1104', tipoVehiculo: 'Camioneta', categoriaEspacio: 'CARRO', marcaVehiculo: 'Renault Duster', placaVehiculo: 'QWE-456', fechaSolicitud: '20 Oct, 2023', estado: 'EN ESPERA' },
    { id: 4, posicion: 4, residenteNombre: 'Andrea Castro', documento: '1050607080', telefono: '3105556677', torreApto: 'Torre 2 - 401', tipoVehiculo: 'Automóvil', categoriaEspacio: 'CARRO', marcaVehiculo: 'Mazda 3', placaVehiculo: 'XYZ-987', fechaSolicitud: '22 Oct, 2023', estado: 'EN ESPERA' }
  ];

  // Observables para que los componentes se suscriban y reaccionen en tiempo real
  carSlots$ = new BehaviorSubject<ParkingSlot[]>([]);
  motoSlots$ = new BehaviorSubject<ParkingSlot[]>([]);
  solicitudes$ = new BehaviorSubject<SolicitudItem[]>(this.solicitudes);

  constructor() {
    this.initSpaces();
  }

  // Genera los 100 carros y 150 motos
  private initSpaces() {
    for (let i = 1; i <= 100; i++) {
      let estado: SlotStatus = 'libre';
      let vehiculo = undefined;

      if (i === 1) {
        estado = 'ocupado';
        vehiculo = { placa: 'VIP-001', tipo: 'Automóvil', linea: 'Mazda 3', propietarioNombre: 'Juan Delgado', unidad: 'Torre A - 402' };
      } else if (i === 2) {
        estado = 'asignado';
        vehiculo = { placa: 'QWE-456', tipo: 'Camioneta', linea: 'Renault Duster', propietarioNombre: 'Maria Peña', unidad: 'Torre B - 105' };
      }

      this.cars.push({ id: `C-${i}`, numero: `${i}`, tipo: 'CARRO', estado, vehiculo });
    }

    for (let i = 1; i <= 150; i++) {
      let estado: SlotStatus = 'libre';
      let vehiculo = undefined;

      if (i === 1) {
        estado = 'ocupado';
        vehiculo = { placa: 'MTO-111', tipo: 'Motocicleta', linea: 'Yamaha FZ', propietarioNombre: 'Andrés Morales', unidad: 'Torre A - 101' };
      }
      this.motos.push({ id: `M-${i}`, numero: `${i}`, tipo: 'MOTO', estado, vehiculo });
    }

    // Emitimos los datos iniciales
    this.carSlots$.next(this.cars);
    this.motoSlots$.next(this.motos);
  }

  // Trae TODOS los espacios disponibles según el tipo
  getAvailableSpaces(tipo: 'CARRO' | 'MOTO'): ParkingSlot[] {
    const list = tipo === 'CARRO' ? this.cars : this.motos;
    return list.filter(slot => slot.estado === 'libre');
  }

  // Lógica de asignación compartida (Desde Solicitudes)
  asignarEspacio(solicitudId: number, numeroCelda: string): boolean {
    const solicitudIndex = this.solicitudes.findIndex(s => s.id === solicitudId);
    if (solicitudIndex === -1) return false;

    const solicitud = this.solicitudes[solicitudIndex];
    const list = solicitud.categoriaEspacio === 'CARRO' ? this.cars : this.motos;
    const slot = list.find(s => s.numero === numeroCelda && s.estado === 'libre');

    if (!slot) return false; // El espacio ya no está libre o no existe

    // 1. Ocupar el espacio
    slot.estado = 'ocupado';
    slot.vehiculo = {
      placa: solicitud.placaVehiculo,
      tipo: solicitud.tipoVehiculo,
      linea: solicitud.marcaVehiculo,
      propietarioNombre: solicitud.residenteNombre,
      unidad: solicitud.torreApto
    };

    // 2. Marcar solicitud como aprobada y sacarla de la vista
    solicitud.estado = 'APROBADA';

    // 3. Notificar a toda la aplicación de los cambios
    this.carSlots$.next(this.cars);
    this.motoSlots$.next(this.motos);
    this.solicitudes$.next(this.solicitudes);

    return true;
  }

  // Asigna un espacio directamente desde el mapa (sin solicitud previa)
  asignarEspacioDirecto(numeroCelda: string, tipo: VehicleType, placa: string, nombre: string, unidad: string): boolean {
    const list = tipo === 'CARRO' ? this.cars : this.motos;
    const slot = list.find(s => s.numero === numeroCelda && s.estado === 'libre');

    if (!slot) return false;

    slot.estado = 'ocupado';
    slot.vehiculo = {
      placa: placa,
      tipo: tipo,
      propietarioNombre: nombre,
      unidad: unidad
    };

    // Notificar a toda la aplicación
    this.carSlots$.next(this.cars);
    this.motoSlots$.next(this.motos);

    return true;
  }
}
