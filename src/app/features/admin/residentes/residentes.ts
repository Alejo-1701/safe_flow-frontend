import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importación de componentes compartidos usando el alias @shared
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

  residentsList: ResidentItem[] = [
    {
      id: 1,
      nombre: 'Carlos Rodríguez',
      iniciales: 'CR',
      torre: 'Torre 1',
      apto: '402',
      vehiculos: ['ABC-123'],
      telefono: '310 123 4567'
    },
    {
      id: 2,
      nombre: 'Marta Lucía Gomez',
      iniciales: 'MG',
      torre: 'Torre 3',
      apto: '101',
      vehiculos: [],
      telefono: '315 987 6543'
    },
    {
      id: 3,
      nombre: 'Juan Felipe Castro',
      iniciales: 'JC',
      torre: 'Torre 2',
      apto: '505',
      vehiculos: ['XYZ-789', 'MNO-456'],
      telefono: '300 444 5566'
    },
    {
      id: 4,
      nombre: 'Elena Beltrán',
      iniciales: 'EB',
      torre: 'Torre 1',
      apto: '203',
      vehiculos: ['DEF-012'],
      telefono: '312 777 8899'
    }
  ];

  totalResidentesCount: string = '1,240';

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

  viewDetail(resident: ResidentItem): void {
    console.log('Ver detalle del residente:', resident);
  }
}
