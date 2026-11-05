import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  private storageKey = 'safe_flow_visitor_slots';

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

  private slotsSubject: BehaviorSubject<VisitorParkingSlot[]>;
  public slots$: Observable<VisitorParkingSlot[]>;

  constructor() {
    let initial = this.initialSlots;

    // Validamos que estemos ejecutando en el navegador antes de usar localStorage
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          initial = JSON.parse(saved);
        } catch (e) {
          console.error('Error al leer localStorage', e);
        }
      }
    }

    this.slotsSubject = new BehaviorSubject<VisitorParkingSlot[]>(initial);
    this.slots$ = this.slotsSubject.asObservable();
  }

  private persistAndEmit(slots: VisitorParkingSlot[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(slots));
    }
    this.slotsSubject.next([...slots]);
  }

  registrarIngresoVisitante(slotId: string, placaVehiculo: string): boolean {
    const currentSlots = this.slotsSubject.getValue();
    const slotIndex = currentSlots.findIndex(s => s.id === slotId);

    if (slotIndex !== -1 && currentSlots[slotIndex].estado === 'libre') {
      const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const updatedSlots = currentSlots.map((slot, index) => {
        if (index === slotIndex) {
          return {
            ...slot,
            estado: 'ocupado' as const,
            placa: placaVehiculo.toUpperCase(),
            horaIngreso: horaActual
          };
        }
        return slot;
      });

      this.persistAndEmit(updatedSlots);
      return true;
    }
    return false;
  }

  liberarEspacio(slotId: string): void {
    const currentSlots = this.slotsSubject.getValue();

    const updatedSlots = currentSlots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          estado: 'libre' as const,
          placa: undefined,
          horaIngreso: undefined
        };
      }
      return slot;
    });

    this.persistAndEmit(updatedSlots);
  }
}
