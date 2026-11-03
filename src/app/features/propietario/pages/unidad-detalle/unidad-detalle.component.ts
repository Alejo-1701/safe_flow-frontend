import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-unidad-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, Modal],
  templateUrl: './unidad-detalle.component.html',
  styleUrls: ['./unidad-detalle.component.scss']
})
export class UnidadDetalleComponent implements OnInit {
  unidad: any;
  showInhabilitarModal = false;
  
  // Mock data
  private mockPropiedades: any = {
    'PR-A402': {
      nombre: 'Torre A - Apt 402',
      id: 'PR-A402',
      estado: 'OCUPADO',
      residente: {
        nombre: 'Familia Gómez',
        rol: 'Residente Principal',
        tipo: 'Arrendamiento Vigente',
        telefono: '+57 300 456 7890',
        email: 'familia.gomez@email.com',
        inicio: '15 de Marzo, 2023'
      }
    },
    'PR-B105': {
      nombre: 'Torre B - Apt 105',
      id: 'PR-B105',
      estado: 'OCUPADO',
      residente: {
        nombre: 'Familia Martínez',
        rol: 'Residente Principal',
        tipo: 'Arrendamiento Vigente',
        telefono: '+57 300 111 2222',
        email: 'familia.martinez@email.com',
        inicio: '1 de Enero, 2024'
      }
    },
    'PR-A201': {
      nombre: 'Torre A - Apt 201',
      id: 'PR-A201',
      estado: 'VACANTE',
      residente: null
    },
    'PR-C303': {
      nombre: 'Torre C - Apt 303',
      id: 'PR-C303',
      estado: 'VACANTE',
      residente: null
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.mockPropiedades[id]) {
      this.unidad = this.mockPropiedades[id];
    } else {
      // Fallback si no encuentra o no hay ID
      this.unidad = { nombre: 'Unidad no encontrada', id: 'N/A', estado: 'N/A', residente: {} };
    }
  }

  inhabilitarInquilino() {
    this.showInhabilitarModal = true;
  }

  confirmarInhabilitacion() {
    // Lógica para liberar la propiedad
    this.unidad.estado = 'VACANTE';
    this.unidad.residente = null;
    this.showInhabilitarModal = false;
  }
}
