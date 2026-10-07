import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';   // <--- Importante para que reconozca <router-outlet />
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent, FieldConfig } from './shared/components/form-field/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, FormFieldComponent], // <--- Agregamos RouterOutlet aquí
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'safe-flow'; // <--- Soluciona el error de {{ title() }} o {{ title }}

  miFormulario: FormGroup;

  camposFormulario: FieldConfig[] = [
    { key: 'nombreCompleto', label: 'Nombre Completo', type: 'text', placeholder: 'Ej: Juan Pérez' },
    { key: 'correo', label: 'Correo Electrónico', type: 'email', placeholder: 'juan@email.com' },
    {key: 'torre', label: 'Torre', type:'text', placeholder: 'torre 1'},
    {key: 'apto', label:'apto', type: 'select', options: [
      { label: 'Apartamento 101', value: '101' },
      { label: 'Apartamento 202', value: '202' },
      { label: 'Apartamento 303', value: '303' }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.miFormulario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  guardarDatos(datos: any) {
    console.log('Datos:', datos);
    alert('¡Formulario enviado con éxito!');
  }

  cancelarAccion() {
    this.miFormulario.reset();
  }
}
