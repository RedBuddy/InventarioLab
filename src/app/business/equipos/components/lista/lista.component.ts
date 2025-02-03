import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export default class ListaComponent {

  searchText = '';
  selectedStatus = '';
  currentPage = 1;

  equipos = [
    {
      nombre: 'Centrífuga X-2000',
      tipo: 'analitico',
      ubicacion: 'Lab 3',
      estado: 'activo',
      ultimaCalibracion: '2024-03-15'
    },
    {
      nombre: 'Espectrómetro UV',
      tipo: 'medicion',
      ubicacion: 'Lab 2',
      estado: 'mantenimiento',
      ultimaCalibracion: '2024-02-28'
    },
    {
      nombre: 'Microscopio Electrónico',
      tipo: 'especializado',
      ubicacion: 'Lab 1',
      estado: 'inactivo',
      ultimaCalibracion: '2023-12-15'
    }
  ];

  get filteredEquipos() {
    return this.equipos.filter(equipo => {
      const matchesSearch = equipo.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        equipo.tipo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        equipo.ubicacion.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus = this.selectedStatus ? equipo.estado === this.selectedStatus : true;

      return matchesSearch && matchesStatus;
    });
  }

  getCalibrationClass(date: string): string {
    const calibrationDate = new Date(date);
    const today = new Date();
    const diffTime = calibrationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'calibration-critical';
    if (diffDays <= 30) return 'calibration-warning';
    return '';
  }

}
