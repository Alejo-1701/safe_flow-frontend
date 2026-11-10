import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-asignar-inquilino',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Modal],
  templateUrl: './asignar-inquilino.component.html',
  styleUrls: ['./asignar-inquilino.component.scss']
})
export class AsignarInquilinoComponent {
  unidadNombre = '';
  documento = '';
  residenteEncontrado: any = null;
  buscando = false;
  mensajeError = '';
  showSuccessModal = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.unidadNombre = this.route.snapshot.queryParams['unidad'] || 'Unidad';
  }

  buscarResidente(): void {
    if (!this.documento) return;
    this.buscando = true;
    this.mensajeError = '';
    this.residenteEncontrado = null;

    // Simulación de búsqueda en base de datos
    setTimeout(() => {
      this.buscando = false;
      if (this.documento === '123456789') {
        this.residenteEncontrado = {
          nombre: 'Juan Pérez',
          correo: 'juan.perez@email.com',
          telefono: '+57 300 123 4567'
        };
      } else {
        this.mensajeError = 'Residente no encontrado. Verifique el número de documento.';
      }
    }, 1000);
  }

  volver(): void {
    // Si la ruta anterior existe, navegar atrás. Si no, ir al dashboard.
    // Como alternativa sencilla, podemos verificar la ruta actual
    this.router.navigate(['/propietario']);
  }

  cancelar(): void {
    this.volver();
  }

  confirmar(): void {
    // Lógica de guardado...
    console.log('Inquilino asignado:', this.residenteEncontrado);
    this.showSuccessModal = true;
  }

  cerrarModalExito(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/propietario']);
  }
}
