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
}
