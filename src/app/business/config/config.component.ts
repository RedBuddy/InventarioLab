import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { IUsuario } from '../../core/models/usuario.model';


@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export default class ConfigComponent implements OnInit {

  usuario: IUsuario = { id: 0, nombre: '', email: '', contrasena: '', rol: 'usuario', activo: true };
  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  imagenPerfil: File | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    const usuarioId = this.authService.getUserIdFromToken();

    if (!usuarioId) {
      this.authService.logout();
      return;
    }

    this.usuarioService.getUsuario(usuarioId).subscribe({
      next: (data: IUsuario) => {
        this.usuario = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  actualizarPerfil(): void {
    this.usuarioService.updateUsuario(this.usuario.id, this.usuario).subscribe({
      next: () => {
        this.successMessage = 'Perfil actualizado correctamente';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.successMessage = null;
      }
    });
  }

  cambiarContrasena(): void {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.usuarioService.cambiarContrasena(this.usuario.id, this.contrasenaActual, this.nuevaContrasena).subscribe({
      next: () => {
        this.successMessage = 'Contraseña actualizada correctamente';
        this.errorMessage = null;
        this.contrasenaActual = '';
        this.nuevaContrasena = '';
        this.confirmarContrasena = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.successMessage = null;
      }
    });
  }

  seleccionarImagenPerfil(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenPerfil = file;
    }
  }

  actualizarImagenPerfil(): void {
    if (this.imagenPerfil) {
      const formData = new FormData();
      formData.append('imagen', this.imagenPerfil);

      this.usuarioService.actualizarImagenPerfil(this.usuario.id, formData).subscribe({
        next: () => {
          this.successMessage = 'Imagen de perfil actualizada correctamente';
          this.errorMessage = null;
          this.cargarUsuario(); // Recargar los datos del usuario para actualizar la imagen
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.successMessage = null;
        }
      });
    } else {
      this.errorMessage = 'Por favor, selecciona una imagen';
    }
  }

}
