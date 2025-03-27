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

  // Mensajes para cada sección
  perfilSuccessMessage: string | null = null;
  perfilErrorMessage: string | null = null;
  contrasenaSuccessMessage: string | null = null;
  contrasenaErrorMessage: string | null = null;
  imagenSuccessMessage: string | null = null;
  imagenErrorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
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
        this.perfilErrorMessage = null;
      },
      error: (err) => {
        this.perfilErrorMessage = err.message;
      }
    });
  }

  actualizarNombre(): void {
    this.usuarioService.updateUsuarioNombre(this.usuario.id, this.usuario.nombre).subscribe({
      next: () => {
        this.perfilSuccessMessage = 'Nombre actualizado correctamente';
        this.perfilErrorMessage = null;
      },
      error: (err) => {
        this.perfilErrorMessage = err.message;
        this.perfilSuccessMessage = null;
      }
    });
  }

  cambiarContrasena(): void {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.contrasenaErrorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.usuarioService.cambiarContrasena(this.usuario.id, this.contrasenaActual, this.nuevaContrasena).subscribe({
      next: () => {
        this.contrasenaSuccessMessage = 'Contraseña actualizada correctamente';
        this.contrasenaErrorMessage = null;
        this.contrasenaActual = '';
        this.nuevaContrasena = '';
        this.confirmarContrasena = '';
      },
      error: (err) => {
        this.contrasenaErrorMessage = err.message;
        this.contrasenaSuccessMessage = null;
      }
    });
  }

  seleccionarImagenPerfil(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que el archivo sea una imagen
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        this.imagenErrorMessage = 'El archivo debe ser una imagen (JPEG, PNG o GIF).';
        this.imagenPerfil = null;
        return;
      }

      // Validar que el tamaño del archivo no supere 16 MB
      const maxSizeInBytes = 16 * 1024 * 1024; // 16 MB
      if (file.size > maxSizeInBytes) {
        this.imagenErrorMessage = 'El archivo no debe superar los 16 MB.';
        this.imagenPerfil = null;
        return;
      }

      // Si pasa las validaciones, asignar el archivo
      this.imagenPerfil = file;
      this.imagenErrorMessage = null;
    }
  }

  actualizarImagenPerfil(): void {
    if (this.imagenPerfil) {
      const formData = new FormData();
      formData.append('imagen', this.imagenPerfil);

      this.usuarioService.actualizarImagenPerfil(this.usuario.id, formData).subscribe({
        next: () => {
          this.imagenSuccessMessage = 'Imagen de perfil actualizada correctamente';
          this.imagenErrorMessage = null;
          this.cargarUsuario(); // Recargar los datos del usuario para actualizar la imagen
        },
        error: (err) => {
          this.imagenErrorMessage = err.message;
          this.imagenSuccessMessage = null;
        }
      });
    } else {
      this.imagenErrorMessage = 'Por favor, selecciona una imagen';
    }
  }

}
