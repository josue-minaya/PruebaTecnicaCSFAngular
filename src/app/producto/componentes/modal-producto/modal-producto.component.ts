import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductoService } from '../../../Service/producto.service';
import { ProductoCrear } from '../../../Models/RegistrarProducto.interface';

@Component({
  selector: 'app-modal-producto',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css',
})
export class ModalProductoComponent {
  fb = inject(FormBuilder);
  productoService = inject(ProductoService);
  @Output() onClose = new EventEmitter<void>();

  form: FormGroup = this.fb.group({
    nombre_producto: ['', Validators.required],
    nroLote: [''],
    costo: [0, [Validators.required, Validators.min(0.01)]],
  });

  cerrar() {
    this.onClose.emit();
  }
  guardar() {
    if (this.form.invalid) {
      alert('Formulario inválido');
      return;
    }

    const { nombre_producto, nroLote, costo } = this.form.value;
    const nuevoProducto: ProductoCrear = {
      nombre_producto,
      nroLote,
      costo,
      precioVenta: +(costo * 1.35).toFixed(2), // Calcula el precio automáticamente
    };

    this.productoService.registrarProducto(nuevoProducto).subscribe({
      next: () => {
        alert('Producto creado con éxito');
        //  this.onProductoCreado.emit();
        this.cerrar();
      },
      error: () => alert('Error al crear producto'),
    });
  }
}
