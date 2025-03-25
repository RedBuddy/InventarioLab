import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export default class LoginComponent {

  showPassword = signal(false);
  identifier: string = '';
  password: string = '';
  errorMessage: string | null = null;

  // Variables para el modal de restablecer contraseña
  isResetPasswordModalOpen: boolean = false;
  resetEmail: string = '';
  resetPasswordMessage: string | null = null;
  resetPasswordError: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  login(): void {
    this.authService.login(this.identifier, this.password).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.error('Login failed', err);
      }
    });
  }

  openResetPasswordModal(event: Event): void {
    event.preventDefault();
    this.isResetPasswordModalOpen = true;
    this.resetEmail = '';
    this.resetPasswordMessage = null;
    this.resetPasswordError = null;
  }

  closeResetPasswordModal(): void {
    this.isResetPasswordModalOpen = false;
  }

  sendPasswordResetEmail(form: any): void {
    if (form.invalid) {
      return; // No enviar si el formulario es inválido
    }

    this.authService.requestPasswordReset(this.resetEmail).subscribe({
      next: () => {
        this.resetPasswordMessage = 'Correo de recuperación enviado exitosamente.';
        this.resetPasswordError = null;
      },
      error: (err) => {
        this.resetPasswordError = err.message || 'Error al enviar el correo de recuperación.';
        this.resetPasswordMessage = null;
      }
    });
  }
}
