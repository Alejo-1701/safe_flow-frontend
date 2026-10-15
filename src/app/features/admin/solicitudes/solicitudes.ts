import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes compartidos reutilizables
import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { ButtonComponent } from '@shared/components/button/button';

export interface SolicitudItem {
  id: number;
  posicion: number;
  nombre: string;
  torreApto: string;
  tipoVehiculo: string;
  vehiculoDetalle?: string;
  fecha: string;
  estado: 'PENDIENTE' | 'EN ESPERA';
  iconoVehiculo: string;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ButtonComponent
  ],
  templateUrl: './solicitudes.html',
  styleUrls: ['./solicitudes.scss']
})
export class SolicitudesComponent {
  searchTerm: string = '';
  selectedEstado: string = 'TODOS';
  selectedTipoVehiculo: string = 'TODOS';

  // Datos del residente en turno especial
  nextInTurn = {
    nombre: 'Carlos Rodríguez',
    torreApto: 'Torre 4 - Apto 502',
    vehiculoDetalle: 'Automóvil (BMW X3 - KLS-482)'
  };

  // Lista de espera de parqueaderos (Mock basado en el diseño)
  solicitudesList: SolicitudItem[] = [
    {
      id: 1,
      posicion: 1,
      nombre: 'Carlos Rodríguez',
      torreApto: 'Torre 4 - 502',
      tipoVehiculo: 'Automóvil',
      vehiculoDetalle: 'BMW X3 - KLS-482',
      fecha: '12 Oct, 2023',
      estado: 'PENDIENTE',
      iconoVehiculo: 'directions_car'
    },
    {
      id: 2,
      posicion: 2,
      nombre: 'Marta Gómez',
      torreApto: 'Torre 1 - 203',
      tipoVehiculo: 'Motocicleta',
      fecha: '15 Oct, 2023',
      estado: 'EN ESPERA',
      iconoVehiculo: 'two_wheeler'
    },
    {
      id: 3,
      posicion: 3,
      nombre: 'Jorge Martínez',
      torreApto: 'Torre 6 - 1104',
      tipoVehiculo: 'Camioneta',
      fecha: '20 Oct, 2023',
      estado: 'EN ESPERA',
      iconoVehiculo: 'directions_car'
    },
    {
      id: 4,
      posicion: 4,
      nombre: 'Andrea Castro',
      torreApto: 'Torre 2 - 401',
      tipoVehiculo: 'Automóvil',
      fecha: '22 Oct, 2023',
      estado: 'EN ESPERA',
      iconoVehiculo: 'directions_car'
    }
  ];

  // Métricas inferiores
  metrics = {
    espaciosDisponibles: '04',
    solicitudesEnEspera: '24',
    promedioEspera: '30 Días'
  };

  get filteredSolicitudes(): SolicitudItem[] {
    return this.solicitudesList.filter(item => {
      const matchesSearch =
        item.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.torreApto.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesEstado =
        this.selectedEstado === 'TODOS' || item.estado === this.selectedEstado;

      const matchesVehiculo =
        this.selectedTipoVehiculo === 'TODOS' ||
        item.tipoVehiculo.toLowerCase() === this.selectedTipoVehiculo.toLowerCase();

      return matchesSearch && matchesEstado && matchesVehiculo;
    });
  }

  // --- Funciones de interacción ---

  assignSpace(solicitud?: SolicitudItem): void {
    const target = solicitud ? solicitud.nombre : this.nextInTurn.nombre;
    alert(`Iniciando proceso de asignación de espacio disponible para: ${target}`);
  }

  viewProfile(solicitud?: SolicitudItem): void {
    const target = solicitud ? solicitud.nombre : this.nextInTurn.nombre;
    alert(`Cargando información del perfil de: ${target}`);
  }

  openActionMenu(solicitud: SolicitudItem): void {
    alert(`Opciones de gestión para la solicitud de ${solicitud.nombre}:\n\n1. Asignar parqueadero\n2. Mover turno al final\n3. Cancelar solicitud`);
  }

  applyFilters(): void {
    console.log('Filtros de lista de espera aplicados.');
  }
}
