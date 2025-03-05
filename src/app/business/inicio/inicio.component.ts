import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactivoService } from '../../core/services/reactivo.service';
import { EquipoService } from '../../core/services/equipo.service';
import { MovimientosService } from '../../core/services/movimientos.service';
import { MantenimientoService } from '../../core/services/mantenimiento.service';
import { ReporteService } from '../../core/services/reporte.service';
import { IReporteGenerado } from '../../core/models/reporte_generado.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export default class InicioComponent implements OnInit {

  totalReactivos: number = 0;
  totalEquipos: number = 0;
  articulosStockBajo: any[] = [];
  movimientosRecientes: any[] = [];
  // proximosMantenimientos: any[] = [];
  reportesGenerados: IReporteGenerado[] = [];
  errorMessage: string | null = null;

  constructor(
    private reactivoService: ReactivoService,
    private equipoService: EquipoService,
    private movimientosService: MovimientosService,
    private mantenimientoService: MantenimientoService,
    private reporteService: ReporteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarReactivos();
    this.cargarEquipos();
    this.cargarArticulosStockBajo();
    this.cargarMovimientosRecientes();
    // this.cargarProximosMantenimientos();
    this.cargarReportesGenerados();
  }

  cargarReactivos(): void {
    this.reactivoService.getReactivos().subscribe({
      next: (data) => {
        this.totalReactivos = data.length;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  cargarEquipos(): void {
    this.equipoService.getEquipos().subscribe({
      next: (data) => {
        this.totalEquipos = data.length;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  cargarArticulosStockBajo(): void {
    this.reactivoService.getReactivos().subscribe({
      next: (data) => {
        this.articulosStockBajo = data
          .filter(reactivo => reactivo.cantidad_total <= 10)
          .sort((a, b) => a.cantidad_total - b.cantidad_total)
          .slice(0, 5); // Mostrar los 5 reactivos con stock más bajo
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  cargarMovimientosRecientes(): void {
    this.movimientosService.getMovimientos().subscribe({
      next: (data) => {
        this.movimientosRecientes = data
          .sort((a, b) => new Date(b.fecha_movimiento).getTime() - new Date(a.fecha_movimiento).getTime())
          .slice(0, 5); // Mostrar los 5 movimientos más recientes
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  // cargarProximosMantenimientos(): void {
  //   this.mantenimientoService.getMantenimientos().subscribe({
  //     next: (data) => {
  //       this.proximosMantenimientos = data
  //         .filter(mantenimiento => new Date(mantenimiento.fecha_mantenimiento) >= new Date())
  //         .sort((a, b) => new Date(a.fecha_mantenimiento).getTime() - new Date(b.fecha_mantenimiento).getTime())
  //         .slice(0, 5); // Mostrar los 5 mantenimientos más próximos
  //       this.errorMessage = null;
  //     },
  //     error: (err) => {
  //       this.errorMessage = err.message;
  //     }
  //   });
  // }

  cargarReportesGenerados(): void {
    this.reporteService.getReportesGenerados().subscribe({
      next: (data: IReporteGenerado[]) => {
        this.reportesGenerados = data
          .sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime())
          .slice(0, 5); // Mostrar los 5 reportes más recientes
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  getStockClass(cantidad: number): string {
    if (cantidad <= 5) {
      return 'stock-critical';
    } else if (cantidad <= 10) {
      return 'stock-warning';
    } else {
      return 'stock-normal';
    }
  }
}