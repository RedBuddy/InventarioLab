import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export default class MainComponent {

  searchText = '';
  currentPage = 1;

  stockItems = [
    {
      nombre: 'BENZENETRICARBOXYLIC ACID',
      categoria: 'Addios',
      stockActual: 0,
      stockMinimo: 5,
      ultimoMovimiento: '2024-05-01'
    },
    {
      nombre: 'Cyclohexane-tricarboxilic acid',
      categoria: 'Addios',
      stockActual: 1,
      stockMinimo: 3,
      ultimoMovimiento: '2024-05-10'
    },
    // ... más datos
  ];

  getStockClass(actual: number, minimo: number): string {
    if (actual === 0) return 'critical';
    if (actual <= minimo) return 'warning';
    return '';
  }

}
