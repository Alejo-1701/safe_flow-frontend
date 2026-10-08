import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  miFormulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.miFormulario = this.fb.group({
    });
  }
  title = 'safe-flow-frontend';
}

