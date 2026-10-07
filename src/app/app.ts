import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, RouterOutlet, ButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'SafeFlow';


  manejarAccion() {
    alert('¡Botón de SafeFlow presionado con éxito!');
  }
=======
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'safe-flow-frontend';
>>>>>>> 346412151513f05502704a688f3244dcf12789ea
}
