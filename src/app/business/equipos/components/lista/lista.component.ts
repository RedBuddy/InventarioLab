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

  equipos = [
    {
      nombre: 'Centrífuga X-2000',
      tipo: 'Centrífuga',
      numeroSerie: 'CTF-23847',
      ubicacion: 'Lab 3',
      estado: 'Disponible',
      ultimaCalibracion: '2024-03-15'
    },
    {
      nombre: 'Espectrómetro UV',
      tipo: 'Espectrómetro',
      numeroSerie: 'ESP-98432',
      ubicacion: 'Lab 2',
      estado: 'En mantenimiento',
      ultimaCalibracion: '2024-02-28'
    }
  ];

  currentPage = 1;
  searchText = '';

  getEstadoClass(estado: string): string {
    return {
      'Disponible': 'status-available',
      'En mantenimiento': 'status-maintenance',
      'Fuera de servicio': 'status-out'
    }[estado] || '';
  }

}
