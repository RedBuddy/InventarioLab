import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})

export class SearchComponent {
  isDropdownVisible = false;
  isAuthenticated = false;
  userRole: string | null = null;
  userImage: string | null = null;
  searchControl: FormControl = new FormControl('');


  // constructor(private authService: AuthService, private router: Router) { }

  searchFilter(): void {
    const searchValue = this.searchControl.value;
    if (searchValue) {
      // this.router.navigate(['inicio/filtrar', searchValue]);
    }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  goToProfile() {
    // const userId = this.authService.getUserIdFromToken();
    // if (userId) {
    //   this.router.navigate(['/perfil', userId]);
    // }
  }

  logout() {
    // this.authService.logout();
  }
}
