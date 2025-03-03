import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IEquipo } from '../../../../core/models/equipo.model';
import { IMantenimiento } from '../../../../core/models/mantenimiento.model';
import { EquipoService } from '../../../../core/services/equipo.service';
import { MantenimientoService } from '../../../../core/services/mantenimiento.service';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export default class ListaComponent implements OnInit {

  searchText = '';
  selectedStatus = '';
  currentPage = 1;
  itemsPerPage = 10;
  equipos: IEquipo[] = [];
  filteredEquipos: IEquipo[] = [];
  paginatedEquipos: IEquipo[] = [];
  mantenimientos: IMantenimiento[] = [];
  errorMessage: string | null = null;
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isMantenimientoModalOpen: boolean = false;
  equipoSeleccionado: IEquipo = {
    id: 0,
    nombre: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    alimentacion: '',
    amperaje: '',
    frecuencia: '',
    potencia: '',
    proyecto: '',
    ubicacion: '',
    imagen: {
      type: '',
      data: []
    },
    estado: 'activo'
  };

  nuevoEquipo: IEquipo = {
    id: 0,
    nombre: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    alimentacion: '',
    amperaje: '',
    frecuencia: '',
    potencia: '',
    proyecto: '',
    ubicacion: '',
    imagen: {
      type: '',
      data: []
    },
    estado: 'activo'
  };

  nuevoMantenimiento: IMantenimiento = {
    id: 0,
    equipo_id: 0,
    fecha_mantenimiento: new Date(),
    descripcion: '',
    tecnico: ''
  };

  constructor(
    private equipoService: EquipoService,
    private mantenimientoService: MantenimientoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEquipos();
    this.cargarMantenimientos();
  }

  cargarEquipos(): void {
    this.equipoService.getEquipos().subscribe({
      next: (data: IEquipo[]) => {
        this.equipos = data;
        this.filteredEquipos = data;
        this.paginarEquipos();
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  cargarMantenimientos(): void {
    this.mantenimientoService.getMantenimientos().subscribe({
      next: (data: IMantenimiento[]) => {
        this.mantenimientos = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  filtrarEquipos(): void {
    this.filteredEquipos = this.equipos.filter(equipo => {
      const matchesSearch = equipo.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (equipo.ubicacion ?? '').toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus = this.selectedStatus ? equipo.estado === this.selectedStatus : true;

      return matchesSearch && matchesStatus;
    });
    this.paginarEquipos();
  }

  paginarEquipos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEquipos = this.filteredEquipos.slice(startIndex, endIndex);
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
    this.paginarEquipos();
  }

  getUltimaCalibracion(equipoId: number): string {
    const mantenimientos = this.mantenimientos.filter(m => m.equipo_id === equipoId);
    if (mantenimientos.length === 0) return 'N/A';
    const ultimaCalibracion = mantenimientos.reduce((latest, current) => {
      return new Date(latest.fecha_mantenimiento) > new Date(current.fecha_mantenimiento) ? latest : current;
    });
    return new Date(ultimaCalibracion.fecha_mantenimiento).toLocaleDateString();
  }

  abrirModal(): void {
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  abrirModalEdicion(equipo: IEquipo): void {
    this.equipoSeleccionado = { ...equipo };
    this.isEditModalOpen = true;
  }

  cerrarModalEdicion(): void {
    this.isEditModalOpen = false;
  }

  abrirModalMantenimiento(equipo: IEquipo): void {
    this.equipoSeleccionado = { ...equipo };
    this.nuevoMantenimiento.equipo_id = equipo.id;
    this.isMantenimientoModalOpen = true;
  }

  cerrarModalMantenimiento(): void {
    this.isMantenimientoModalOpen = false;
  }

  agregarEquipo(): void {
    this.equipoService.createEquipo(this.nuevoEquipo).subscribe({
      next: (equipo: IEquipo) => {
        this.equipos.push(equipo);
        this.filteredEquipos = this.equipos;
        this.paginarEquipos();
        this.nuevoEquipo = {
          id: 0,
          nombre: '',
          marca: '',
          modelo: '',
          numero_serie: '',
          alimentacion: '',
          amperaje: '',
          frecuencia: '',
          potencia: '',
          proyecto: '',
          ubicacion: '',
          imagen: {
            type: '',
            data: []
          },
          estado: 'activo'
        };
        this.errorMessage = null;
        this.cerrarModal();
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  actualizarEquipo(): void {
    if (this.equipoSeleccionado) {
      this.equipoService.updateEquipo(this.equipoSeleccionado.id, this.equipoSeleccionado).subscribe({
        next: (equipo: IEquipo) => {
          const index = this.equipos.findIndex(e => e.id === equipo.id);
          if (index !== -1) {
            this.equipos[index] = equipo;
            this.filteredEquipos = this.equipos;
            this.paginarEquipos();
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

  registrarMantenimiento(): void {
    this.mantenimientoService.createMantenimiento(this.nuevoMantenimiento).subscribe({
      next: (mantenimiento: IMantenimiento) => {
        this.mantenimientos.push(mantenimiento);
        this.errorMessage = null;
        this.cerrarModalMantenimiento();
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  eliminarEquipo(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      this.equipoService.deleteEquipo(id).subscribe({
        next: () => {
          this.cargarEquipos();
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

}
