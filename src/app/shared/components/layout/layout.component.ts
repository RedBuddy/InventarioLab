import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from '../aside/aside.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [AsideComponent, SearchComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export default class LayoutComponent {

}
