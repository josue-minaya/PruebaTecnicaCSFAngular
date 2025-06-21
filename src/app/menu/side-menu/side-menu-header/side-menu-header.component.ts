import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
  styleUrl: './side-menu-header.component.css',
})
export class SideMenuHeaderComponent {
  router = inject(Router);

  CerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }
}
