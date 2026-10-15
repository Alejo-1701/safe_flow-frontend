import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes compartidos reutilizables
import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { ButtonComponent } from '@shared/components/button/button';

export interface TariffItem {
  tipoVehiculo: string;
  tarifaMinuto: string;
  tiempoGracia: string;
}

export interface PersonalUser {
  id: number;
  nombre: string;
  iniciales: string;
  turno: string;
  rol: 'GUARDA' | 'ADMIN';
  activo: boolean;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ButtonComponent
  ],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.scss']
})
export class ConfiguracionComponent {
  // 1. Parámetros Económicos
  isEditingTariffs: boolean = false;
  tarifas: TariffItem[] = [
    { tipoVehiculo: 'Carros', tarifaMinuto: '$100 COP', tiempoGracia: '15 min' },
    { tipoVehiculo: 'Motos', tarifaMinuto: '$50 COP', tiempoGracia: '10 min' }
  ];

  datosLegales = {
    razonSocial: 'ParkResidencial S.A.S',
    nit: '900.123.456-7',
    resolucionDian: 'Res. 187600012345 del 2023/01/15'
  };

  // 2. Notificaciones & Alertas
  alertasPushAdmin: boolean = true;
  alertasEmailPropietario: boolean = false;

  umbralesMalUso = {
    tiempoHoras: 48,
    accionAutomatica: 'Notificar Guarda'
  };

  accionesDisponibles: string[] = [
    'Notificar Guarda',
    'Bloquear Salida Automáticamente',
    'Generar Alerta Crítica'
  ];

  // 3. Accesos y Personal
  usuariosPersonal: PersonalUser[] = [
    {
      id: 1,
      nombre: 'Ricardo Mendoza',
      iniciales: 'RM',
      turno: 'Turno: Mañana',
      rol: 'GUARDA',
      activo: true
    },
    {
      id: 2,
      nombre: 'Sandra Castro',
      iniciales: 'SC',
      turno: 'Turno: Noche',
      rol: 'ADMIN',
      activo: true
    }
  ];

  // 4. Auditoría y Reportes Automáticos
  frecuenciasReporte = ['Diario', 'Semanal', 'Mensual'];

  reporteIngresosFrecuencia: string = 'Diario';
  reporteOcupacionFrecuencia: string = 'Semanal';

  // --- Métodos y Funcionalidades ---

  toggleTariffEdit(): void {
    this.isEditingTariffs = !this.isEditingTariffs;
  }

  togglePushAlert(): void {
    this.alertasPushAdmin = !this.alertasPushAdmin;
  }

  toggleEmailAlert(): void {
    this.alertasEmailPropietario = !this.alertasEmailPropietario;
  }

  toggleUserStatus(user: PersonalUser): void {
    user.activo = !user.activo;
  }

  openNewUserModal(): void {
    alert('Abriendo formulario para registrar un nuevo miembro del personal.');
  }

  cancelChanges(): void {
    if (confirm('¿Desea descartar los cambios no guardados en la configuración?')) {
      // Restablece los datos a su estado por defecto
      this.datosLegales = {
        razonSocial: 'ParkResidencial S.A.S',
        nit: '900.123.456-7',
        resolucionDian: 'Res. 187600012345 del 2023/01/15'
      };
      this.alertasPushAdmin = true;
      this.alertasEmailPropietario = false;
      this.umbralesMalUso.tiempoHoras = 48;
      this.umbralesMalUso.accionAutomatica = 'Notificar Guarda';
      this.isEditingTariffs = false;
    }
  }

  saveGlobalConfiguration(): void {
    const payload = {
      datosLegales: this.datosLegales,
      tarifas: this.tarifas,
      notificaciones: {
        pushAdmin: this.alertasPushAdmin,
        emailPropietario: this.alertasEmailPropietario,
        umbrales: this.umbralesMalUso
      },
      reportesProgramados: {
        ingresos: this.reporteIngresosFrecuencia,
        ocupacion: this.reporteOcupacionFrecuencia
      }
    };

    console.log('Guardando configuración global en backend:', payload);
    alert('¡Configuración global guardada correctamente!');
  }
}
