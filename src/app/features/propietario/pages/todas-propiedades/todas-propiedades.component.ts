import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { CardWidgetComponent } from '../../../../shared/components/card-widget/card-widget.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-todas-propiedades',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, CardWidgetComponent, StatusBadgeComponent],
  templateUrl: './todas-propiedades.component.html',
  styleUrls: ['./todas-propiedades.component.scss']
})
export class TodasPropiedadesComponent {
  constructor(public router: Router) {}

  propiedades = [
    { id: 'PR-A402', nombre: 'Torre A - Apt 402', ocupado: true, residente: 'Familia Gómez' },
    { id: 'PR-B105', nombre: 'Torre B - Apt 105', ocupado: true, residente: 'Familia Martínez' },
    { id: 'PR-A201', nombre: 'Torre A - Apt 201', ocupado: false, residente: null },
    { id: 'PR-C303', nombre: 'Torre C - Apt 303', ocupado: false, residente: null }
  ];
}
