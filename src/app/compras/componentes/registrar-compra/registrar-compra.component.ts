import { CompraService } from '../../../Service/compra.service';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../../Service/producto.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductoConStock } from '../../../Models/RegistrarVenta.interface';
import { MovimientoService } from '../../../Service/movimiento.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CompraRequest } from '../../../Models/RegistrarCompra.interface';
import { ModalProductoComponent } from '../../../producto/componentes/modal-producto/modal-producto.component';

@Component({
  selector: 'app-registrar-compra',
  imports: [ReactiveFormsModule, CommonModule, ModalProductoComponent],
  templateUrl: './registrar-compra.component.html',
  styleUrl: './registrar-compra.component.css',
})
export default class RegistrarCompraComponent {
  fb = inject(FormBuilder);
  productoService = inject(ProductoService);
  movimientoService = inject(MovimientoService);
  compraService = inject(CompraService);
  modalVisible = signal(false);
  productos: ProductoConStock[] = [];

  formCompra!: FormGroup;

  ngOnInit(): void {
    this.formCompra = this.fb.group({
      detalles: this.fb.array([]),
    });

    this.cargarProductosConStock();
  }

  get detalles(): FormArray {
    return this.formCompra.get('detalles') as FormArray;
  }

  cargarProductosConStock() {
    forkJoin({
      productos: this.productoService.getListaproductos(),
      movimientos: this.movimientoService.getListaMovimiento(),
    }).subscribe(({ productos, movimientos }) => {
      const stockMap = new Map<number, number>();
      for (const mov of movimientos.data) {
        for (const d of mov.detalles) {
          const signo = mov.id_TipoMovimiento === 'ENTRADA' ? 1 : -1;
          const prev = stockMap.get(d.id_Producto) || 0;
          stockMap.set(d.id_Producto, prev + signo * d.cantidad);
        }
      }

      this.productos = productos.data.map((p) => ({
        ...p,
        stock: stockMap.get(p.id_producto) || 0,
      }));

      this.agregarDetalle();
    });
  }

  agregarDetalle() {
    const prod = this.productos[0];
    const grupo = this.fb.group({
      id_Producto: [prod.id_producto, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      costo: [Math.round(prod.precioVenta / 1.35)],
    });

    grupo.get('id_Producto')?.valueChanges.subscribe((id: number | null) => {
      if (id != null) {
        const producto = this.productos.find((p) => p.id_producto === +id);
        if (producto) {
          grupo.patchValue(
            {
              costo: producto.precioVenta / 1.35,
            },
            { emitEvent: false }
          );
        }
      }
    });

    this.detalles.push(grupo);
  }

  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
  }

  guardarCompra() {
    if (this.formCompra.invalid) {
      alert('Formulario inválido');
      return;
    }

    const compra: CompraRequest = {
      detalles: this.detalles.value.map((d: any) => ({
        id_Producto: d.id_Producto,
        cantidad: d.cantidad,
        costo: d.costo,
        precio: d.costo,
      })),
    };

    this.compraService.registrarCompra(compra).subscribe({
      next: (resp) => {
        alert('Compra registrada con éxito');
        console.log('Respuesta:', resp);
        this.formCompra.reset();
        this.detalles.clear();
        this.cargarProductosConStock();
      },
      error: (err) => {
        console.error(' Error al registrar la compra', err);
        alert('Error al registrar la compra');
      },
    });
  }

  RegistrarProducto() {
    this.modalVisible.set(true);
  }

  cerrarModal() {
    this.modalVisible.set(false);
  }
}
