import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReporteService } from '../../../../core/services/reporte.service';
import { EquipoService } from '../../../../core/services/equipo.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export default class MainComponent implements OnInit {

  selectedReportType = 'stock';
  fechaInicio = '';
  fechaFin = '';
  equipoId = '';
  equipos: any[] = [];
  reportData: any[] = [];
  reportHeaders: string[] = [];
  errorMessage: string | null = null;

  constructor(
    private reporteService: ReporteService,
    private equipoService: EquipoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos(): void {
    this.equipoService.getEquipos().subscribe({
      next: (data: any[]) => {
        this.equipos = [{ id: '', nombre: 'TODOS' }, ...data];
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  limpiarDatosReporte(): void {
    this.reportData = [];
    this.reportHeaders = [];
    this.errorMessage = null;
  }

  generarReporte(): void {
    this.limpiarDatosReporte();

    const usuarioId = this.authService.getUserIdFromToken();
    if (!usuarioId) {
      this.authService.logout();
      return;
    }

    const params = {
      tipo: this.selectedReportType,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      equipoId: this.equipoId,
      usuarioId: usuarioId
    };

    this.reporteService.generarReporte(
      this.selectedReportType,
      this.fechaInicio,
      this.fechaFin,
      this.equipoId,
      usuarioId
    ).subscribe({
      next: (data: any) => {
        if (typeof data === 'string') {
          this.errorMessage = data;
        } else {
          this.reportData = data;
          this.reportHeaders = data.length > 0 ? Object.keys(data[0]) : [];
          this.errorMessage = null;
          this.generarPDF();
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  generarPDF(): void {
    const doc = new jsPDF('landscape');
    const title = `Reporte de ${this.selectedReportType.charAt(0).toUpperCase() + this.selectedReportType.slice(1)}`;
    const headers = [this.reportHeaders];
    const data = this.reportData.map(row => this.reportHeaders.map(header => row[header]));

    doc.text(title, 14, 16);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        // Ajusta el ancho de las columnas según sea necesario
      },
      margin: { top: 20, right: 10, bottom: 20, left: 10 },
    });

    doc.save(`${title}.pdf`);
  }
}