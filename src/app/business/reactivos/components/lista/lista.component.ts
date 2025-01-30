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

  reactivos = [
    {
      nombre: 'BENZENETRICARBOXYLIC ACID',
      categoria: 'Addios',
      stock: 0,
      ubicacion: 'A23',
      caducidad: '2025-12-31'
    },
    {
      nombre: 'Cyclohexane-tricarboxilic acid',
      categoria: 'Addios',
      stock: 1,
      ubicacion: 'B12',
      caducidad: '2024-11-30'
    },
    {
      nombre: 'Cyclohexane-tricarboxilic acid',
      categoria: 'Addios',
      stock: 1,
      ubicacion: 'B12',
      caducidad: '2024-11-30'
    }, {
      nombre: 'Cyclohexane-tricarboxilic acid',
      categoria: 'Addios',
      stock: 1,
      ubicacion: 'B12',
      caducidad: '2024-11-30'
    }
  ];

  currentPage = 1;
  searchText = '';

}
