import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovimientoProducto } from '../../../Models/ListaMovimientoProducto.interface';

@Component({
  selector: 'app-modal-movimiento',
  imports: [],
  templateUrl: './modal-movimiento.component.html',
  styleUrl: './modal-movimiento.component.css',
})
export class ModalMovimientoComponent {
  @Input() movimientos: MovimientoProducto[] = [];
  @Output() onClose = new EventEmitter<void>();

  cerrar() {
    this.onClose.emit();
  }
}
