import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ParkingSyncService, VisitorParkingSlot } from '@shared/services/parking-sync.service';

@Component({
  selector: 'app-visitor-parking-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitor-parking-map.html',
  styleUrls: ['./visitor-parking-map.scss']
})
export class VisitorParkingMapComponent implements OnInit, OnDestroy {
  /**
   * - 'guardia': Permite hacer clic en espacios libres para registrar placas y liberar celdas.
   * - 'residente': Muestra la disponibilidad en tiempo real ocultando las placas por privacidad.
   */
  @Input() mode: 'guardia' | 'residente' = 'residente';

  private sub!: Subscription;
  slots: VisitorParkingSlot[] = [];

  // Control de Modal de Registro (Solo para Guardia)
  isModalOpen: boolean = false;
  selectedSlot: VisitorParkingSlot | null = null;
  placaInput: string = '';

  constructor(private parkingSync: ParkingSyncService) {}

  ngOnInit(): void {
    this.sub = this.parkingSync.slots$.subscribe(data => {
      // Forzamos la nueva referencia de arreglo para que Angular redibuje la pantalla de inmediato
      this.slots = [...data];
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  onSlotClick(slot: VisitorParkingSlot): void {
    if (this.mode === 'guardia') {
      if (slot.estado === 'libre') {
        this.selectedSlot = slot;
        this.placaInput = '';
        this.isModalOpen = true;
      } else {
        if (confirm(`¿El vehículo ${slot.placa} ha salido del parqueadero de visitantes?`)) {
          this.parkingSync.liberarEspacio(slot.id);
        }
      }
    }
  }

  // Limita, quita caracteres especiales y convierte a mayúsculas automáticamente (Formato Colombia: 6 caracteres)
  onPlacaInput(event: any): void {
    const valorLimpio = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    this.placaInput = valorLimpio;
    event.target.value = valorLimpio;
  }

  confirmarIngreso(): void {
    if (!this.placaInput.trim() || this.placaInput.length !== 6) {
      alert('La placa en Colombia debe contener exactamente 6 caracteres (ej: ABC123 o XYZ12A).');
      return;
    }

    if (this.selectedSlot) {
      const exito = this.parkingSync.registrarIngresoVisitante(this.selectedSlot.id, this.placaInput);
      if (exito) {
        alert(`Vehículo ${this.placaInput} asignado con éxito a la celda ${this.selectedSlot.id}`);
        this.cerrarModal();
      } else {
        alert('Error al asignar el espacio.');
      }
    }
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.selectedSlot = null;
    this.placaInput = '';
  }
}
