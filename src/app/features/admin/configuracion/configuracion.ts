import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';

export interface TariffItem {
  tipoVehiculo: string;
  tarifaMinuto: number;
  tiempoGracia: number;
}

export interface PersonalUser {
  id: number;
  nombre: string;
  cedula: string;
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
    SidebarComponent
  ],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.scss']
})
export class ConfiguracionComponent {
  // --- 1. Parámetros Económicos y Legales ---
  isEditingTariffs: boolean = false;

  tarifas: TariffItem[] = [
    { tipoVehiculo: 'Carros', tarifaMinuto: 100, tiempoGracia: 15 },
    { tipoVehiculo: 'Motos', tarifaMinuto: 50, tiempoGracia: 10 }
  ];

  datosLegales = {
    razonSocial: 'ParkResidencial S.A.S',
    nit: '900.123.456-7',
    resolucionDian: 'Res. 187600012345 del 2023/01/15'
  };

  // --- 2. Notificaciones & Alertas ---
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

  // --- 3. Accesos y Personal (Vigilantes y Admins) ---
  usuariosPersonal: PersonalUser[] = [
    {
      id: 1,
      nombre: 'Ricardo Mendoza',
      cedula: '1020304050',
      iniciales: 'RM',
      turno: 'Turno: Mañana',
      rol: 'GUARDA',
      activo: true
    },
    {
      id: 2,
      nombre: 'Sandra Castro',
      cedula: '1098765432',
      iniciales: 'SC',
      turno: 'Turno: Noche',
      rol: 'ADMIN',
      activo: true
    }
  ];

  // Control de Modal "Nuevo Usuario / Vigilante"
  isNewUserModalOpen: boolean = false;
  nuevoUsuarioForm = {
    nombre: '',
    cedula: '',
    turno: 'Turno: Mañana',
    rol: 'GUARDA' as 'GUARDA' | 'ADMIN',
    password: ''
  };

  // --- 4. Auditoría y Reportes Automáticos ---
  frecuenciasReporte = ['Diario', 'Semanal', 'Mensual'];
  reporteIngresosFrecuencia: string = 'Diario';
  reporteOcupacionFrecuencia: string = 'Semanal';

  // ==========================================
  // MÉTODOS Y ACCIONES FUNCIONALES
  // ==========================================

  toggleTariffEdit(): void {
    if (this.isEditingTariffs) {
      // Validaciones lógicas de cobros
      for (let t of this.tarifas) {
        if (t.tarifaMinuto <= 0 || t.tiempoGracia < 0) {
          alert(`Error en tarifa de ${t.tipoVehiculo}: Los valores económicos deben ser mayores a 0.`);
          return;
        }
      }
      alert('Parámetros económicos actualizados correctamente.');
    }
    this.isEditingTariffs = !this.isEditingTariffs;
  }

  togglePushAlert(): void {
    this.alertasPushAdmin = !this.alertasPushAdmin;
    console.log(`Alertas Push Admin cambiadas a: ${this.alertasPushAdmin}`);
  }

  toggleEmailAlert(): void {
    this.alertasEmailPropietario = !this.alertasEmailPropietario;
    console.log(`Alertas Email Propietarios cambiadas a: ${this.alertasEmailPropietario}`);
  }

  // --- Gestión de Personal (Vigilantes) ---
  openNewUserModal(): void {
    this.nuevoUsuarioForm = {
      nombre: '',
      cedula: '',
      turno: 'Turno: Mañana',
      rol: 'GUARDA',
      password: ''
    };
    this.isNewUserModalOpen = true;
  }

  closeNewUserModal(): void {
    this.isNewUserModalOpen = false;
  }

  registrarNuevoUsuario(): void {
    if (!this.nuevoUsuarioForm.nombre.trim() || !this.nuevoUsuarioForm.cedula.trim() || !this.nuevoUsuarioForm.password.trim()) {
      alert('Por favor complete todos los campos obligatorios (Nombre, Cédula y Contraseña).');
      return;
    }

    // Generar iniciales automáticamente
    const partes = this.nuevoUsuarioForm.nombre.trim().split(' ');
    const iniciales = partes.length >= 2
      ? (partes[0][0] + partes[1][0]).toUpperCase()
      : partes[0].substring(0, 2).toUpperCase();

    const nuevoRegistro: PersonalUser = {
      id: Date.now(),
      nombre: this.nuevoUsuarioForm.nombre.trim(),
      cedula: this.nuevoUsuarioForm.cedula.trim(),
      iniciales: iniciales,
      turno: this.nuevoUsuarioForm.turno,
      rol: this.nuevoUsuarioForm.rol,
      activo: true
    };

    this.usuariosPersonal.push(nuevoRegistro);
    alert(`¡Usuario ${nuevoRegistro.nombre} (${nuevoRegistro.rol}) registrado con éxito en la base de datos!`);
    this.closeNewUserModal();
  }

  toggleUserStatus(user: PersonalUser): void {
    user.activo = !user.activo;
    const estadoStr = user.activo ? 'habilitado' : 'inhabilitado';
    alert(`El usuario ${user.nombre} ha sido ${estadoStr} correctamente.`);
  }

  // --- Botones Globales ---
  cancelChanges(): void {
    if (confirm('¿Desea descartar los cambios no guardados y restaurar los valores iniciales?')) {
      this.isEditingTariffs = false;
      this.tarifas = [
        { tipoVehiculo: 'Carros', tarifaMinuto: 100, tiempoGracia: 15 },
        { tipoVehiculo: 'Motos', tarifaMinuto: 50, tiempoGracia: 10 }
      ];
      this.datosLegales = {
        razonSocial: 'ParkResidencial S.A.S',
        nit: '900.123.456-7',
        resolucionDian: 'Res. 187600012345 del 2023/01/15'
      };
      this.alertasPushAdmin = true;
      this.alertasEmailPropietario = false;
      this.umbralesMalUso = { tiempoHoras: 48, accionAutomatica: 'Notificar Guarda' };
      alert('Se han descartado los cambios.');
    }
  }

  saveGlobalConfiguration(): void {
    const configGlobal = {
      empresa: this.datosLegales,
      tarifasCobro: this.tarifas,
      alertasNotificaciones: {
        push: this.alertasPushAdmin,
        email: this.alertasEmailPropietario,
        umbrales: this.umbralesMalUso
      },
      personalAutorizado: this.usuariosPersonal,
      reportes: {
        ingresos: this.reporteIngresosFrecuencia,
        ocupacion: this.reporteOcupacionFrecuencia
      }
    };

    console.log('Guardando configuración global:', configGlobal);
    alert('¡Configuración global guardada y aplicada en el sistema exitosamente!');
  }
}
