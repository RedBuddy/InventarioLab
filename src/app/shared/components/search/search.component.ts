import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit, OnDestroy {
  isDropdownVisible = false;
  isAuthenticated = false;
  userRole: string | null = null;
  userImage: string | null = null;
  searchControl: FormControl = new FormControl('');
  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      })
    );

    this.subscriptions.add(
      this.authService.userRole$.subscribe(userRole => {
        this.userRole = userRole;
      })
    );

    this.subscriptions.add(
      this.authService.userImage$.subscribe(userImage => {
        this.userImage = userImage;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  searchFilter(): void {
    const searchValue = this.searchControl.value;
    if (searchValue) {
      this.router.navigate(['inicio/filtrar', searchValue]);
    }
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  goToProfile(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.router.navigate(['/perfil', userId]);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
