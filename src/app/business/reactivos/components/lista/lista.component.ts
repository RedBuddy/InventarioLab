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
  selectedCategory = '';
  currentPage = 1;

  reactivos = [
    {
      nombre: 'BENZENETRICARBOXYLIC ACID',
      categoria: 'quimicos',
      stock: 0,
      ubicacion: 'A23',
      caducidad: '2025-12-31'
    },
    {
      nombre: 'Cyclohexane-tricarboxilic acid',
      categoria: 'quimicos',
      stock: 1,
      ubicacion: 'B12',
      caducidad: '2024-11-30'
    },
    {
      nombre: 'SULFONYL-DIMIDAZOLE',
      categoria: 'especiales',
      stock: 5,
      ubicacion: 'C45',
      caducidad: '2024-06-15'
    }
  ];

  get filteredReactivos() {
    return this.reactivos.filter(reactivo => {
      const matchesSearch = reactivo.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        reactivo.categoria.toLowerCase().includes(this.searchText.toLowerCase()) ||
        reactivo.ubicacion.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory = this.selectedCategory ? reactivo.categoria === this.selectedCategory : true;

      return matchesSearch && matchesCategory;
    });
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-critical';
    if (stock <= 2) return 'stock-warning';
    return '';
  }

  getExpirationClass(date: string): string {
    const expirationDate = new Date(date);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'expiration-critical';
    if (diffDays <= 30) return 'expiration-warning';
    return '';
  }
}
