import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { FieldConfig, FormFieldComponent } from './shared/components/form-field/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, FormFieldComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private fb: FormBuilder) {
    this.miFormulario = this.fb.group({
    });
  }
  title = 'safe-flow-frontend';
  miFormulario : FormGroup;
  campos:FieldConfig[]=[{
  key: "usuario",
  label: "usuario",
  type: 'text',
  placeholder: "su nombre"
  }];
}
