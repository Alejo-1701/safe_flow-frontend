import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  credentials = {
    identifier: '',
    password: '',
    rememberMe: false
  };

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.credentials.identifier || !this.credentials.password) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    console.log('Datos de inicio de sesión:', this.credentials);
    alert('¡Intento de inicio de sesión registrado con éxito!');
  }
}
