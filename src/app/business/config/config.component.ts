import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUsuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export default class ConfigComponent implements OnInit {
  usuarioForm!: FormGroup;
  usuarioId!: number;
  errorMessage: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('id')!;
    this.inicializarFormulario();
    this.cargarUsuario();
  }

  inicializarFormulario(): void {
    this.usuarioForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', Validators.required),
      rol: new FormControl('', Validators.required),
      activo: new FormControl(false),
      imagen: new FormControl(null)
    });
  }

  cargarUsuario(): void {
    this.usuarioService.getUsuario(this.usuarioId).subscribe({
      next: (usuario: IUsuario) => {
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          contrasena: usuario.contrasena,
          rol: usuario.rol,
          activo: usuario.activo
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const binaryString = e.target.result;
        const base64String = btoa(binaryString);
        this.usuarioForm.patchValue({
          imagen: {
            type: file.type,
            data: Array.from(atob(base64String), c => c.charCodeAt(0))
          }
        });
      };
      reader.readAsBinaryString(file);
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const usuario: IUsuario = this.usuarioForm.value;
      this.usuarioService.updateUsuario(this.usuarioId, usuario).subscribe({
        next: () => {
          console.log('Usuario actualizado con éxito');
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }
}
