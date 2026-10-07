
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './shared/components/button/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonComponent],
  templateUrl: './app.html',  // Asegúrate de que coincida con el nombre real de tu archivo HTML
  styleUrl: './app.scss'
})
export class App {
  title = 'SafeFlow';

  // Función que se ejecuta al hacer clic en el botón principal
  manejarAccion() {
    alert('¡Botón de SafeFlow presionado con éxito!');
  }
}
