import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReporteService } from '../../../../core/services/reporte.service';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  generarReporte(): void {
    this.reporteService.generarReporte(this.selectedReportType, this.fechaInicio, this.fechaFin, 1).subscribe({
      next: (data: any) => {
        this.reportData = data;
        this.reportHeaders = data.length > 0 ? Object.keys(data[0]) : [];
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

}
