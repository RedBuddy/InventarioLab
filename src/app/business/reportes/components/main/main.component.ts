import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export default class MainComponent {

  @ViewChild('reportChart') chartRef: any;
  chart: any;

  selectedReportType = 'stock';
  startDate = '';
  endDate = '';

  reports = [
    { title: 'Reporte de Stock Enero 2024', date: '2024-01-31' },
    { title: 'Movimientos Diciembre 2023', date: '2023-12-31' },
    { title: 'Caducidades 2024', date: '2024-01-15' }
  ];

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Reactivos', 'Equipos', 'Consumibles'],
        datasets: [{
          label: 'Cantidad',
          data: [120, 45, 78],
          backgroundColor: [
            'rgba(52, 152, 219, 0.8)',
            'rgba(46, 204, 113, 0.8)',
            'rgba(241, 196, 15, 0.8)'
          ],
          borderColor: [
            'rgba(52, 152, 219, 1)',
            'rgba(46, 204, 113, 1)',
            'rgba(241, 196, 15, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.chart = new Chart(this.chartRef.nativeElement, config);
  }

}
