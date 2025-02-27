import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactivo } from '../../../../core/models/reactivo.model';
import { ICategoria } from '../../../../core/models/categoria.model';
import { ReactivoService } from '../../../../core/services/reactivo.service';
import { CategoriaService } from '../../../../core/services/categoria.service';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})

export default class ListaComponent implements OnInit {

  reactivos: IReactivo[] = [];
  filteredReactivos: IReactivo[] = [];
  categorias: ICategoria[] = [];
  searchText: string = '';
  selectedCategory: string = '';
  errorMessage: string | null = null;
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  reactivoSeleccionado: IReactivo = {
    id: 0,
    clave: '',
    cas: '',
    numero: '',
    nombre: '',
    pureza: '',
    cantidad_total: 0,
    unidad_medida: '',
    categoria_id: 0,
    estado: 'disponible'
  };

  nuevoReactivo: IReactivo = {
    id: 0,
    clave: '',
    cas: '',
    numero: '',
    nombre: '',
    pureza: '',
    cantidad_total: 0,
    unidad_medida: '',
    categoria_id: 0,
    estado: 'disponible'
  };

  constructor(
    private reactivoService: ReactivoService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarReactivos();
    this.cargarCategorias();
  }

  cargarReactivos(): void {
    this.reactivoService.getReactivos().subscribe({
      next: (data: IReactivo[]) => {
        this.reactivos = data;
        this.filteredReactivos = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data: ICategoria[]) => {
        this.categorias = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  filtrarReactivos(): void {
    this.filteredReactivos = this.reactivos.filter(reactivo => {
      return (this.searchText === '' || reactivo.nombre.toLowerCase().includes(this.searchText.toLowerCase())) &&
        (this.selectedCategory === '' || reactivo.categoria_id === +this.selectedCategory);
    });
  }

  getCategoriaNombre(categoria_id: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoria_id);
    return categoria ? categoria.nombre : 'Desconocida';
  }

  getStockClass(stock: number): string {
    if (stock <= 5) {
      return 'stock-critical';
    } else if (stock <= 10) {
      return 'stock-warning';
    } else {
      return 'stock-normal';
    }
  }

  abrirModal(): void {
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  abrirModalEdicion(reactivo: IReactivo): void {
    this.reactivoSeleccionado = { ...reactivo };
    this.isEditModalOpen = true;
  }

  cerrarModalEdicion(): void {
    this.isEditModalOpen = false;
  }

  agregarReactivo(): void {
    this.reactivoService.createReactivo(this.nuevoReactivo).subscribe({
      next: (reactivo: IReactivo) => {
        this.reactivos.push(reactivo);
        this.filteredReactivos = this.reactivos;
        this.nuevoReactivo = {
          id: 0,
          clave: '',
          cas: '',
          numero: '',
          nombre: '',
          pureza: '',
          cantidad_total: 0,
          unidad_medida: '',
          categoria_id: 0,
          estado: 'disponible'
        };
        this.errorMessage = null;
        this.cerrarModal();
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  actualizarReactivo(): void {
    if (this.reactivoSeleccionado) {
      this.reactivoService.updateReactivo(this.reactivoSeleccionado.id, this.reactivoSeleccionado).subscribe({
        next: (reactivo: IReactivo) => {
          const index = this.reactivos.findIndex(r => r.id === reactivo.id);
          if (index !== -1) {
            this.reactivos[index] = reactivo;
            this.filteredReactivos = this.reactivos;
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

  eliminarReactivo(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este reactivo?')) {
      this.reactivoService.deleteReactivo(id).subscribe({
        next: () => {
          this.cargarReactivos();
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

}
