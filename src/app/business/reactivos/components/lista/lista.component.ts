import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IReactivo } from '../../../../core/models/reactivo.model';
import { ICategoria } from '../../../../core/models/categoria.model';
import { IMovimiento } from '../../../../core/models/movimiento.model';
import { ReactivoService } from '../../../../core/services/reactivo.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { MovimientosService } from '../../../../core/services/movimientos.service';
import { AuthService } from '../../../../core/services/auth.service';

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
  isMovimientoModalOpen: boolean = false;
  userRole: string | null = null;

  private subscriptions: Subscription = new Subscription();

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

  nuevoMovimiento: IMovimiento = {
    tipo: 'entrada',
    reactivo_id: 0,
    cantidad: 0,
    unidad_medida: '',
    fecha_movimiento: new Date(),
    usuario_id: 0
  };

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(
    private reactivoService: ReactivoService,
    private categoriaService: CategoriaService,
    private movimientosService: MovimientosService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.userRole$.subscribe(userRole => {
        this.userRole = userRole;
      })
    );
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
    this.currentPage = 1; // Resetear a la primera página después de filtrar
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

  abrirModalMovimiento(reactivo: IReactivo): void {
    this.reactivoSeleccionado = { ...reactivo };
    this.nuevoMovimiento.reactivo_id = reactivo.id;
    this.nuevoMovimiento.unidad_medida = reactivo.unidad_medida; // Asignar la unidad de medida del reactivo
    this.isMovimientoModalOpen = true;
  }

  cerrarModalMovimiento(): void {
    this.isMovimientoModalOpen = false;
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
        this.cargarReactivos();
        this.cerrarModal();
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  actualizarReactivo(reactivo: IReactivo): void {
    this.reactivoService.updateReactivo(reactivo.id, reactivo).subscribe({
      next: (updatedReactivo: IReactivo) => {
        const index = this.reactivos.findIndex(r => r.id === updatedReactivo.id);
        if (index !== -1) {
          this.reactivos[index] = updatedReactivo;
          this.filteredReactivos = this.reactivos;
        }
        this.errorMessage = null;
        this.cargarReactivos();
        this.cerrarModalEdicion();
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  registrarMovimiento(): void {
    const usuarioId = this.authService.getUserIdFromToken();
    if (!usuarioId) {
      this.authService.logout();
      return;
    }
    this.nuevoMovimiento.usuario_id = usuarioId;

    this.movimientosService.createMovimiento(this.nuevoMovimiento).subscribe({
      next: (movimiento: IMovimiento) => {
        // Actualizar el stock del reactivo
        const reactivo = this.reactivos.find(r => r.id === movimiento.reactivo_id);
        if (reactivo) {
          const cantidadTotal = parseFloat(reactivo.cantidad_total.toString());
          const cantidadMovimiento = parseFloat(movimiento.cantidad.toString());
          if (movimiento.tipo === 'entrada') {
            reactivo.cantidad_total = parseFloat((cantidadTotal + cantidadMovimiento).toFixed(2));
          } else if (movimiento.tipo === 'salida') {
            reactivo.cantidad_total = parseFloat((cantidadTotal - cantidadMovimiento).toFixed(2));
          }
          this.actualizarReactivo(reactivo); // Actualizar el reactivo en el backend
        }
        this.errorMessage = null;
        this.cargarReactivos();
        this.cerrarModalMovimiento();
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
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

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Métodos de paginación
  get paginatedReactivos(): IReactivo[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReactivos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReactivos.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
