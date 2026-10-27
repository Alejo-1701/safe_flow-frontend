import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VisitorParkingSlot {
  id: string; // Ej: 'V-C01', 'V-M01'
  numero: number;
  tipo: 'CARRO' | 'MOTO';
  estado: 'libre' | 'ocupado' | 'asignado';
  placa?: string;
  horaIngreso?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParkingSyncService {
  // Configuración exacta: 5 espacios de Carros y 6 espacios de Motos para visitantes
  private initialSlots: VisitorParkingSlot[] = [
    // --- ZONA CARROS (5 espacios) ---
    { id: 'V-C01', numero: 1, tipo: 'CARRO', estado: 'ocupado', placa: 'ABC-123', horaIngreso: '14:30' },
    { id: 'V-C02', numero: 2, tipo: 'CARRO', estado: 'libre' },
    { id: 'V-C03', numero: 3, tipo: 'CARRO', estado: 'libre' },
    { id: 'V-C04', numero: 4, tipo: 'CARRO', estado: 'libre' },
    { id: 'V-C05', numero: 5, tipo: 'CARRO', estado: 'libre' },

    // --- ZONA MOTOS (6 espacios) ---
    { id: 'V-M01', numero: 1, tipo: 'MOTO', estado: 'ocupado', placa: 'MTO-456', horaIngreso: '15:45' },
    { id: 'V-M02', numero: 2, tipo: 'MOTO', estado: 'libre' },
    { id: 'V-M03', numero: 3, tipo: 'MOTO', estado: 'libre' },
    { id: 'V-M04', numero: 4, tipo: 'MOTO', estado: 'libre' },
    { id: 'V-M05', numero: 5, tipo: 'MOTO', estado: 'libre' },
    { id: 'V-M06', numero: 6, tipo: 'MOTO', estado: 'libre' }
  ];

  private slotsSubject = new BehaviorSubject<VisitorParkingSlot[]>(this.initialSlots);
  public slots$: Observable<VisitorParkingSlot[]> = this.slotsSubject.asObservable();

  registrarIngresoVisitante(slotId: string, placaVehiculo: string): boolean {
    const currentSlots = this.slotsSubject.getValue();
    const slot = currentSlots.find(s => s.id === slotId);

    if (slot && slot.estado === 'libre') {
      slot.estado = 'ocupado';
      slot.placa = placaVehiculo.toUpperCase();
      slot.horaIngreso = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      this.slotsSubject.next([...currentSlots]);
      return true;
    }
    return false;
  }

  liberarEspacio(slotId: string): void {
    const currentSlots = this.slotsSubject.getValue();
    const slot = currentSlots.find(s => s.id === slotId);

    if (slot) {
      slot.estado = 'libre';
      slot.placa = undefined;
      slot.horaIngreso = undefined;
      this.slotsSubject.next([...currentSlots]);
    }
  }
}
