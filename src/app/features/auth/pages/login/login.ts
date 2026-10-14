
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent],
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
  errorMessage: string = '';

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.credentials.identifier.trim()) {
      this.errorMessage = 'Ingresa tu correo electrónico o usuario.';
      return;
    }

    if (!this.credentials.password) {
      this.errorMessage = 'Ingresa tu contraseña.';
      return;
    }

    if (this.credentials.password.length > 128) {
      this.errorMessage = 'La contraseña supera la longitud permitida.';
      return;
    }

    console.log('Datos de inicio de sesión:', {
      identifier: this.credentials.identifier.trim(),
      rememberMe: this.credentials.rememberMe
    });

    this.errorMessage =
      'Falta conectar el inicio de sesión con el servidor.';
  }
}
