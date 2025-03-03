import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IUsuario } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export default class MainComponent implements OnInit {

  searchText = '';
  selectedRole = '';
  usuarios: IUsuario[] = [];
  filteredUsuarios: IUsuario[] = [];
  errorMessage: string | null = null;
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  usuarioSeleccionado: IUsuario = {
    id: 0,
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'usuario',
    activo: true
  };

  nuevoUsuario: IUsuario = {
    id: 0,
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'usuario',
    activo: true
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: IUsuario[]) => {
        this.usuarios = data;
        this.filteredUsuarios = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  filtrarUsuarios(): void {
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchesSearch = usuario.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesRole = this.selectedRole ? usuario.rol === this.selectedRole : true;

      return matchesSearch && matchesRole;
    });
  }

  abrirModal(): void {
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  abrirModalEdicion(usuario: IUsuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.isEditModalOpen = true;
  }

  cerrarModalEdicion(): void {
    this.isEditModalOpen = false;
  }

  agregarUsuario(): void {
    this.usuarioService.createUsuario(this.nuevoUsuario).subscribe({
      next: (usuario: IUsuario) => {
        this.usuarios.push(usuario);
        this.filteredUsuarios = this.usuarios;
        this.nuevoUsuario = {
          id: 0,
          nombre: '',
          email: '',
          contrasena: '',
          rol: 'usuario',
          activo: true
        };
        this.errorMessage = null;
        this.cerrarModal();
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  actualizarUsuario(): void {
    if (this.usuarioSeleccionado) {
      this.usuarioService.updateUsuario(this.usuarioSeleccionado.id!, this.usuarioSeleccionado).subscribe({
        next: (usuario: IUsuario) => {
          const index = this.usuarios.findIndex(u => u.id === usuario.id);
          if (index !== -1) {
            this.usuarios[index] = usuario;
            this.filteredUsuarios = this.usuarios;
          }
          this.errorMessage = null;
          this.cerrarModalEdicion();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

}
