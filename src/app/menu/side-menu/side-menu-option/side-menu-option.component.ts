import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuOption {
  icon: string;
  label: string;
  route: string;
}
@Component({
  selector: 'app-side-menu-option',
  imports: [],
  templateUrl: './side-menu-option.component.html',
  styleUrl: './side-menu-option.component.css',
})
export class SideMenuOptionComponent {
  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Registrar Ventas',
      route: '/dashboard/RegistrarVentas',
    },
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Registrar Compra',
      route: '/dashboard/RegistrarCompras',
    },
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Listar Kardex',
      route: '/dashboard/Productos',
    },
  ];
}
