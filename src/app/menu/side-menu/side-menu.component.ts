import { Component } from '@angular/core';
import { SideMenuHeaderComponent } from './side-menu-header/side-menu-header.component';
import { SideMenuOptionComponent } from './side-menu-option/side-menu-option.component';

@Component({
  selector: 'app-side-menu',
  imports: [SideMenuHeaderComponent, SideMenuOptionComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css',
})
export class SideMenuComponent {}
