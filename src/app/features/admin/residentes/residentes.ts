import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { StatCardComponent } from '@shared/components/stat-card/stat-card';

export interface ResidentItem {
  id: number;
  nombre: string;
  iniciales: string;
  torre: string;
  apto: string;
  vehiculos: string[];
  telefono: string;
  documento?: string;
  email?: string;
}

@Component({
  selector: 'app-residentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    StatCardComponent
  ],
  templateUrl: './residentes.html',
  styleUrls: ['./residentes.scss']
})
export class ResidentesComponent {
  searchTerm: string = '';
  selectedTorre: string = 'TODAS';
  selectedApto: string = 'TODOS';

  // Control de paginación comercial
  currentPage: number = 1;
  pageSize: number = 4;

  // Control de modales y modos
  isDetailModalOpen: boolean = false;
  isEditing: boolean = false;
  selectedResident: ResidentItem | null = null;
  editableResident: ResidentItem | null = null;

  residentsList: ResidentItem[] = [
    {
      id: 1,
      nombre: 'Carlos Rodríguez',
      iniciales: 'CR',
      torre: 'Torre 1',
      apto: '402',
      vehiculos: ['ABC-123'],
      telefono: '310 123 4567',
      documento: '1020304050',
      email: 'carlos.rodriguez@email.com'
    },
    {
      id: 2,
      nombre: 'Marta Lucía Gomez',
      iniciales: 'MG',
      torre: 'Torre 3',
      apto: '101',
      vehiculos: [],
      telefono: '315 987 6543',
      documento: '1098765432',
      email: 'marta.gomez@email.com'
    },
    {
      id: 3,
      nombre: 'Juan Felipe Castro',
      iniciales: 'JC',
      torre: 'Torre 2',
      apto: '505',
      vehiculos: ['XYZ-789', 'MNO-456'],
      telefono: '300 444 5566',
      documento: '1122334455',
      email: 'juan.castro@email.com'
    },
    {
      id: 4,
      nombre: 'Elena Beltrán',
      iniciales: 'EB',
      torre: 'Torre 1',
      apto: '203',
      vehiculos: ['DEF-012'],
      telefono: '312 777 8899',
      documento: '1050607080',
      email: 'elena.beltran@email.com'
    },
    {
      id: 5,
      nombre: 'Andrés Morales',
      iniciales: 'AM',
      torre: 'Torre 2',
      apto: '304',
      vehiculos: ['GHI-999'],
      telefono: '320 555 1234',
      documento: '1010202030',
      email: 'andres.morales@email.com'
    }
  ];

  totalResidentesCount: string = '1,240';

  // --- Lógica de Filtrado y Paginación ---
  get filteredResidents(): ResidentItem[] {
    return this.residentsList.filter(res => {
      const matchesSearch =
        res.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        res.apto.includes(this.searchTerm) ||
        res.telefono.includes(this.searchTerm);

      const matchesTorre =
        this.selectedTorre === 'TODAS' || res.torre === this.selectedTorre;

      return matchesSearch && matchesTorre;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredResidents.length / this.pageSize) || 1;
  }

  get paginatedResidents(): ResidentItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredResidents.slice(startIndex, startIndex + this.pageSize);
  }

  get paginationText(): string {
    const total = this.filteredResidents.length;
    if (total === 0) return 'Mostrando 0 residentes';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, total);
    return `Mostrando ${start} a ${end} de ${total} residentes`;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  // --- Acciones del Modal de Detalles y Edición ---
  viewDetail(resident: ResidentItem): void {
    this.selectedResident = resident;
    this.editableResident = { ...resident }; // Clon para edición segura
    this.isEditing = false;
    this.isDetailModalOpen = true;
  }

  enableEditMode(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.selectedResident) {
      this.editableResident = { ...this.selectedResident };
    }
  }

  saveResidentChanges(): void {
    if (this.editableResident) {
      const index = this.residentsList.findIndex(r => r.id === this.editableResident?.id);
      if (index !== -1) {
        // Actualizar iniciales si cambió el nombre
        const names = this.editableResident.nombre.split(' ');
        const initials = names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0].substring(0, 2);
        this.editableResident.iniciales = initials.toUpperCase();

        this.residentsList[index] = { ...this.editableResident };
        this.selectedResident = { ...this.editableResident };
      }
      this.isEditing = false;
      alert('Información del residente actualizada correctamente.');
    }
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.isEditing = false;
    this.selectedResident = null;
    this.editableResident = null;
  }
}
