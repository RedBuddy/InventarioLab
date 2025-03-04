import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../core/services/categoria.service';
import { ICategoria } from '../../core/models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export default class CategoriasComponent implements OnInit {

  categorias: ICategoria[] = [];
  showModal = false;
  editingCategoria = false;
  currentCategoria: ICategoria = { id: 0, nombre: '', descripcion: '' };
  errorMessage: string | null = null;

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  openModal(categoria?: ICategoria): void {
    if (categoria) {
      this.currentCategoria = { ...categoria };
      this.editingCategoria = true;
    } else {
      this.currentCategoria = { id: 0, nombre: '', descripcion: '' };
      this.editingCategoria = false;
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCategoria(): void {
    if (this.editingCategoria) {
      this.categoriaService.updateCategoria(this.currentCategoria.id, this.currentCategoria).subscribe({
        next: () => {
          this.loadCategorias();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    } else {
      this.categoriaService.createCategoria(this.currentCategoria).subscribe({
        next: () => {
          this.loadCategorias();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

  deleteCategoria(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => {
          this.loadCategorias();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

}
