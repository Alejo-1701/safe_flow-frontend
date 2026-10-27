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
   * Define el modo de visualización:
   * - 'guardia': Permite hacer clic en espacios libres para registrar placas y gestionar entradas.
   * - 'residente': Muestra la disponibilidad en tiempo real pero oculta las placas (privacidad).
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
      this.slots = data;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  // Clic en celda
  onSlotClick(slot: VisitorParkingSlot): void {
    if (this.mode === 'guardia') {
      if (slot.estado === 'libre') {
        // Abrir modal para registrar ingreso
        this.selectedSlot = slot;
        this.placaInput = '';
        this.isModalOpen = true;
      } else {
        // Opcional: Permitir liberar celda si el carro ya salió
        if (confirm(`¿El vehículo ${slot.placa} ha salido del parqueadero de visitantes?`)) {
          this.parkingSync.liberarEspacio(slot.id);
        }
      }
    } else {
      // Modo residente: Solo informativa, no interactiva por seguridad
      console.log('Vista de residente: Espacio', slot.id, slot.estado);
    }
  }

  confirmarIngreso(): void {
    if (!this.placaInput.trim()) {
      alert('Por favor ingrese la placa del vehículo visitante.');
      return;
    }

    if (this.selectedSlot) {
      const exito = this.parkingSync.registrarIngresoVisitante(this.selectedSlot.id, this.placaInput);
      if (exito) {
        alert(`Vehículo ${this.placaInput.toUpperCase()} asignado a la celda ${this.selectedSlot.id}`);
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
