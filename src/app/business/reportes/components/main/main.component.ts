import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReporteService } from '../../../../core/services/reporte.service';
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
  reportData: any[] = [];
  reportHeaders: string[] = [];
  errorMessage: string | null = null;

  constructor(
    private reporteService: ReporteService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
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

    this.reporteService.generarReporte(this.selectedReportType, this.fechaInicio, this.fechaFin, usuarioId).subscribe({
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