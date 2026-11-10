import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '@shared/components/sidebar/sidebar';
import { Modal } from '@shared/components/modal/modal';

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
    SidebarComponent,
    Modal
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

  // --- 3. Accesos y Personal ---
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

  // Modales
  isNewUserModalOpen: boolean = false;
  isConfirmCancelOpen: boolean = false;
  isConfirmUserStatusOpen: boolean = false;
  isSuccessModalOpen: boolean = false;

  modalTitle: string = '¡Operación Exitosa!';
  modalMessage: string = '';
  modalType: 'success' | 'danger' = 'success';

  userToToggle: PersonalUser | null = null;

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
  // MÉTODOS Y ACCIONES FUNCIONALES CON MODALES
  // ==========================================

  toggleTariffEdit(): void {
    if (this.isEditingTariffs) {
      for (let t of this.tarifas) {
        if (t.tarifaMinuto <= 0 || t.tiempoGracia < 0) {
          this.modalTitle = 'Atención';
          this.modalMessage = `Error en tarifa de ${t.tipoVehiculo}: Los valores económicos deben ser mayores a 0.`;
          this.modalType = 'danger';
          this.isSuccessModalOpen = true;
          return;
        }
      }
      this.modalTitle = '¡Actualización Exitosa!';
      this.modalMessage = 'Parámetros económicos actualizados correctamente.';
      this.modalType = 'success';
      this.isSuccessModalOpen = true;
    }
    this.isEditingTariffs = !this.isEditingTariffs;
  }

  togglePushAlert(): void {
    this.alertasPushAdmin = !this.alertasPushAdmin;
  }

  toggleEmailAlert(): void {
    this.alertasEmailPropietario = !this.alertasEmailPropietario;
  }

  // --- Gestión de Personal ---
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
      this.modalTitle = 'Atención';
      this.modalMessage = 'Por favor complete todos los campos obligatorios (Nombre, Cédula y Contraseña).';
      this.modalType = 'danger';
      this.isSuccessModalOpen = true;
      return;
    }

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
    this.closeNewUserModal();

    this.modalTitle = '¡Usuario Registrado!';
    this.modalMessage = `¡Usuario ${nuevoRegistro.nombre} (${nuevoRegistro.rol}) registrado con éxito en la base de datos!`;
    this.modalType = 'success';
    this.isSuccessModalOpen = true;
  }

  pedirConfirmacionEstadoUser(user: PersonalUser): void {
    this.userToToggle = user;
    this.isConfirmUserStatusOpen = true;
  }

  closeConfirmUserStatus(): void {
    this.isConfirmUserStatusOpen = false;
    this.userToToggle = null;
  }

  ejecutarCambioEstadoUser(): void {
    if (this.userToToggle) {
      this.userToToggle.activo = !this.userToToggle.activo;
      const estadoStr = this.userToToggle.activo ? 'habilitado' : 'inhabilitado';
      const nombre = this.userToToggle.nombre;
      this.closeConfirmUserStatus();

      this.modalTitle = 'Estado Actualizado';
      this.modalMessage = `El usuario ${nombre} ha sido ${estadoStr} correctamente.`;
      this.modalType = 'success';
      this.isSuccessModalOpen = true;
    }
  }

  // --- Botones Globales ---
  pedirConfirmacionCancelar(): void {
    this.isConfirmCancelOpen = true;
  }

  closeConfirmCancel(): void {
    this.isConfirmCancelOpen = false;
  }

  ejecutarCancelarCambios(): void {
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
    this.closeConfirmCancel();

    this.modalTitle = 'Cambios Descartados';
    this.modalMessage = 'Se han descartado los cambios y restaurado los valores iniciales.';
    this.modalType = 'success';
    this.isSuccessModalOpen = true;
  }

  saveGlobalConfiguration(): void {
    this.modalTitle = '¡Configuración Guardada!';
    this.modalMessage = '¡Configuración global guardada y aplicada en el sistema exitosamente!';
    this.modalType = 'success';
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }
}
