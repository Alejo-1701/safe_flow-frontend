import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { ButtonComponent } from '@shared/components/button/button';
import { StatCardComponent } from '@shared/components/stat-card/stat-card';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge';
import { Modal } from '@shared/components/modal/modal';

interface ActivityItem {
  placa: string;
  tipo: 'RESIDENTE' | 'VISITANTE';
  fechaEntrada?: string;
  horaEntrada: string;
  horaSalida?: string;
}

interface UserAccessItem {
  unidad: string;
  estado: 'ACTIVO' | 'INACTIVO';
  ultimoAcceso: string;
  residenteNombre: string;
  residenteEmail: string;
  residenteIniciales: string;
  documento?: string;
  telefono?: string;
}

interface ResidentForm {
  tipoDocumento: string;
  numDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  telefono: string;
  torre: string;
  numeroApto: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ButtonComponent,
    StatCardComponent,
    StatusBadgeComponent,
    Modal
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  searchTerm: string = '';
  isRegisterModalOpen: boolean = false;
  isSuccessModalOpen: boolean = false;
  isHistoryModalOpen: boolean = false;
  isUserDetailModalOpen: boolean = false;
  selectedUser: UserAccessItem | null = null;

  currentPage: number = 1;
  pageSize: number = 5;

  newResident: ResidentForm = this.getEmptyResidentForm();

  metrics = {
    ocupacion: '85%',
    recaudo: '$ 1,250.00',
    alertas: '3',
    visitantes: '85'
  };

  recentActivity: ActivityItem[] = [
    { placa: 'KJH-452', tipo: 'RESIDENTE', horaEntrada: '14:45 PM' },
    { placa: 'XYZ-908', tipo: 'VISITANTE', horaEntrada: '14:32 PM' },
    { placa: 'ABC-123', tipo: 'RESIDENTE', horaEntrada: '14:15 PM' },
    { placa: 'LMN-774', tipo: 'RESIDENTE', horaEntrada: '13:58 PM' },
    { placa: 'GFT-332', tipo: 'VISITANTE', horaEntrada: '13:45 PM' },
    { placa: 'PLO-229', tipo: 'RESIDENTE', horaEntrada: '13:20 PM' }
  ];

  fullHistory: ActivityItem[] = [
    { placa: 'KJH-452', tipo: 'RESIDENTE', fechaEntrada: '21 Oct 2026', horaEntrada: '14:45 PM', horaSalida: 'En parqueadero' },
    { placa: 'XYZ-908', tipo: 'VISITANTE', fechaEntrada: '21 Oct 2026', horaEntrada: '14:32 PM', horaSalida: '16:00 PM' },
    { placa: 'ABC-123', tipo: 'RESIDENTE', fechaEntrada: '21 Oct 2026', horaEntrada: '14:15 PM', horaSalida: 'En parqueadero' },
    { placa: 'LMN-774', tipo: 'RESIDENTE', fechaEntrada: '21 Oct 2026', horaEntrada: '13:58 PM', horaSalida: 'En parqueadero' },
    { placa: 'GFT-332', tipo: 'VISITANTE', fechaEntrada: '21 Oct 2026', horaEntrada: '13:45 PM', horaSalida: '14:30 PM' },
    { placa: 'PLO-229', tipo: 'RESIDENTE', fechaEntrada: '21 Oct 2026', horaEntrada: '13:20 PM', horaSalida: '15:10 PM' },
    { placa: 'HJK-999', tipo: 'VISITANTE', fechaEntrada: '21 Oct 2026', horaEntrada: '11:15 AM', horaSalida: '12:45 PM' },
    { placa: 'QWE-444', tipo: 'RESIDENTE', fechaEntrada: '21 Oct 2026', horaEntrada: '10:05 AM', horaSalida: 'En parqueadero' }
  ];

  usersList: UserAccessItem[] = [
    { unidad: 'Torre A - 402', estado: 'ACTIVO', ultimoAcceso: 'Hoy, 08:45 AM', residenteNombre: 'Juan Delgado', residenteEmail: 'j.delgado@email.com', residenteIniciales: 'JD', documento: '1020304050', telefono: '3001234567' },
    { unidad: 'Torre B - 105', estado: 'ACTIVO', ultimoAcceso: 'Ayer, 06:12 PM', residenteNombre: 'Maria Peña', residenteEmail: 'm.pena@email.com', residenteIniciales: 'MP', documento: '1098765432', telefono: '3129876543' },
    { unidad: 'Torre A - 201', estado: 'INACTIVO', ultimoAcceso: '15 Oct, 2023', residenteNombre: 'Ricardo Costa', residenteEmail: 'r.costa@email.com', residenteIniciales: 'RC', documento: '1122334455', telefono: '3151112233' },
    { unidad: 'Torre C - 304', estado: 'ACTIVO', ultimoAcceso: 'Hoy, 10:20 AM', residenteNombre: 'Laura Gómez', residenteEmail: 'l.gomez@email.com', residenteIniciales: 'LG', documento: '1050607080', telefono: '3105556677' },
    { unidad: 'Torre B - 502', estado: 'ACTIVO', ultimoAcceso: 'Hace 2 horas', residenteNombre: 'Carlos Ruiz', residenteEmail: 'c.ruiz@email.com', residenteIniciales: 'CR', documento: '1010202030', telefono: '3023334455' },
    { unidad: 'Torre A - 101', estado: 'INACTIVO', ultimoAcceso: '01 Sep, 2023', residenteNombre: 'Ana Torres', residenteEmail: 'a.torres@email.com', residenteIniciales: 'AT', documento: '1088997766', telefono: '3189998877' },
    { unidad: 'Torre C - 601', estado: 'ACTIVO', ultimoAcceso: 'Hoy, 07:15 AM', residenteNombre: 'Miguel Vargas', residenteEmail: 'm.vargas@email.com', residenteIniciales: 'MV', documento: '1044556677', telefono: '3204445566' }
  ];

  get filteredUsersList(): UserAccessItem[] {
    if (!this.searchTerm.trim()) return this.usersList;
    const term = this.searchTerm.toLowerCase();
    return this.usersList.filter(user =>
      user.residenteNombre.toLowerCase().includes(term) ||
      user.unidad.toLowerCase().includes(term) ||
      user.residenteEmail.toLowerCase().includes(term)
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsersList.length / this.pageSize) || 1;
  }

  get paginatedUsersList(): UserAccessItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsersList.slice(startIndex, startIndex + this.pageSize);
  }

  get paginationText(): string {
    const total = this.filteredUsersList.length;
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

  openUserDetail(user: UserAccessItem): void {
    this.selectedUser = { ...user };
    this.isUserDetailModalOpen = true;
  }

  closeUserDetail(): void {
    this.isUserDetailModalOpen = false;
    this.selectedUser = null;
  }

  updateResident(): void {
    if (this.selectedUser) {
      const index = this.usersList.findIndex(u => u.documento === this.selectedUser?.documento);
      if (index !== -1) {
        this.usersList[index] = { ...this.selectedUser };
      }
      this.closeUserDetail();
      alert('Información del residente actualizada correctamente.');
    }
  }

  openHistoryModal(): void {
    this.isHistoryModalOpen = true;
  }

  closeHistoryModal(): void {
    this.isHistoryModalOpen = false;
  }

  registerResident(): void {
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal(): void {
    this.isRegisterModalOpen = false;
    this.newResident = this.getEmptyResidentForm();
  }

  submitRegisterResident(): void {
    if (!this.newResident.numDocumento || !this.newResident.primerNombre || !this.newResident.primerApellido || !this.newResident.email || !this.newResident.torre || !this.newResident.numeroApto) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const nombreCompleto = `${this.newResident.primerNombre} ${this.newResident.primerApellido}`;
    const iniciales = `${this.newResident.primerNombre.charAt(0)}${this.newResident.primerApellido.charAt(0)}`.toUpperCase();

    this.usersList.unshift({
      unidad: `${this.newResident.torre} - ${this.newResident.numeroApto}`,
      estado: 'ACTIVO',
      ultimoAcceso: 'Recién registrado',
      residenteNombre: nombreCompleto,
      residenteEmail: this.newResident.email,
      residenteIniciales: iniciales,
      documento: this.newResident.numDocumento,
      telefono: this.newResident.telefono
    });

    this.closeRegisterModal();
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }

  exportData(): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.usersList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dashboard_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  private getEmptyResidentForm(): ResidentForm {
    return { tipoDocumento: 'CC', numDocumento: '', primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '', email: '', telefono: '', torre: 'Torre A', numeroApto: '' };
  }
}
