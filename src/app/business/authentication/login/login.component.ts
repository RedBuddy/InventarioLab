import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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


  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }
  login(): void {
    // Implement your login logic here
    console.log('Identifier:', this.identifier);
    console.log('Password:', this.password);
  }
}
