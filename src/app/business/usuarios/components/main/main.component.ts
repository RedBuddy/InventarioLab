import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export default class MainComponent {

  searchText = '';
  selectedRole = '';
  showModal = false;
  editingUser = false;
  currentUser: any = {
    name: '',
    email: '',
    role: 'viewer',
    status: 'active'
  };

  users = [
    {
      name: 'Juan Pérez',
      email: 'juan.perez@lab.com',
      role: 'admin',
      status: 'active',
      lastAccess: '2024-05-20T14:30:00'
    },
    {
      name: 'María Gómez',
      email: 'maria.gomez@lab.com',
      role: 'editor',
      status: 'active',
      lastAccess: '2024-05-19T10:15:00'
    },
    {
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@lab.com',
      role: 'viewer',
      status: 'inactive',
      lastAccess: '2024-05-15T08:45:00'
    }
  ];

  get filteredUsers() {
    return this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesRole = this.selectedRole ? user.role === this.selectedRole : true;

      return matchesSearch && matchesRole;
    });
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }

  openModal(user?: any) {
    if (user) {
      this.currentUser = { ...user };
      this.editingUser = true;
    } else {
      this.currentUser = {
        name: '',
        email: '',
        role: 'viewer',
        status: 'active'
      };
      this.editingUser = false;
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
