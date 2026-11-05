import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { StatCardComponent } from '@shared/components/stat-card/stat-card';
import { ParkingService, ParkingSlot } from '@shared/services/parking.service';

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
export class MapaComponent implements OnInit, OnDestroy {
  // Suscripciones a nuestro "Cerebro" centralizado
  private carSub!: Subscription;
  private motoSub!: Subscription;

  // Almacenamiento local de todos los espacios sincronizados
  carSlots: ParkingSlot[] = [];
  motoSlots: ParkingSlot[] = [];

  // Variables de Paginación
  pageSize: number = 8;
  currentCarPage: number = 1;
  currentMotoPage: number = 1;

  // Control de Modales y Búsqueda
  isDetailModalOpen: boolean = false;
  selectedSpace: ParkingSlot | null = null;
  searchQuery: string = '';

  constructor(
    private parkingService: ParkingService,
    private router: Router // Inyectamos el Router para redireccionar
  ) {}

  ngOnInit(): void {
    // 1. Suscripción Zona de Carros
    this.carSub = this.parkingService.carSlots$.subscribe((cars: ParkingSlot[]) => {
      this.carSlots = cars;
    });

    // 2. Suscripción Zona de Motos
    this.motoSub = this.parkingService.motoSlots$.subscribe((motos: ParkingSlot[]) => {
      this.motoSlots = motos;
    });
  }

  ngOnDestroy(): void {
    if (this.carSub) this.carSub.unsubscribe();
    if (this.motoSub) this.motoSub.unsubscribe();
  }

  // --- Redirección a Solicitudes ---
  goToSolicitudes(): void {
    this.router.navigate(['/admin/solicitudes']);
  }

  // --- Getters Reactivos para las Vistas (Paginación) ---

  get visibleCarSlots(): ParkingSlot[] {
    const offset = (this.currentCarPage - 1) * this.pageSize;
    return this.carSlots.slice(offset, offset + this.pageSize);
  }

  get visibleMotoSlots(): ParkingSlot[] {
    const offset = (this.currentMotoPage - 1) * this.pageSize;
    return this.motoSlots.slice(offset, offset + this.pageSize);
  }

  get totalCarPages(): number {
    return Math.ceil(this.carSlots.length / this.pageSize) || 1;
  }

  get totalMotoPages(): number {
    return Math.ceil(this.motoSlots.length / this.pageSize) || 1;
  }

  // --- Getters Reactivos para las Tarjetas de Estadísticas ---

  get occupiedCarsCount(): number {
    return this.carSlots.filter(s => s.estado !== 'libre').length;
  }

  get occupiedMotosCount(): number {
    return this.motoSlots.filter(s => s.estado !== 'libre').length;
  }

  // --- Controles de Paginación ---

  prevCarPage(): void { if (this.currentCarPage > 1) this.currentCarPage--; }
  nextCarPage(): void { if (this.currentCarPage < this.totalCarPages) this.currentCarPage++; }
  prevMotoPage(): void { if (this.currentMotoPage > 1) this.currentMotoPage--; }
  nextMotoPage(): void { if (this.currentMotoPage < this.totalMotoPages) this.currentMotoPage++; }

  // --- Interacción con Celdas ---

  onSpaceClick(space: ParkingSlot): void {
    if (space.estado === 'libre') {
      // Si la celda está libre, redirigimos a solicitudes para asignar
      this.goToSolicitudes();
    } else {
      // Si está ocupada/asignada, mostramos el modal de detalle
      this.selectedSpace = space;
      this.isDetailModalOpen = true;
    }
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedSpace = null;
  }
}
