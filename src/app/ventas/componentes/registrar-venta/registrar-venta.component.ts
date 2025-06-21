import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../Service/producto.service';
import { MovimientoService } from '../../../Service/movimiento.service';
import { forkJoin } from 'rxjs';
import {
  ProductoConStock,
  VentaRequest,
} from '../../../Models/RegistrarVenta.interface';
import { VentaService } from '../../../Service/venta.service';

@Component({
  selector: 'app-registrar-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-venta.component.html',
  styleUrl: './registrar-venta.component.css',
})
export default class RegistrarVentaComponent implements OnInit {
  fb = inject(FormBuilder);
  productoService = inject(ProductoService);
  movimientoService = inject(MovimientoService);
  ventaService = inject(VentaService);
  productos: ProductoConStock[] = [];

  formVenta!: FormGroup;
  subTotal = signal(0);
  igv = signal(0);
  total = signal(0);

  ngOnInit(): void {
    this.formVenta = this.fb.group({
      detalles: this.fb.array([]),
    });

    this.cargarProductosConStock();
  }

  get detalles(): FormArray {
    return this.formVenta.get('detalles') as FormArray;
  }

  cargarProductosConStock(limpiar: boolean = false) {
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

      if (limpiar) {
        this.detalles.clear();
        this.agregarDetalle();
      }
    });
  }

  agregarDetalle() {
    const prod = this.productos[0];
    const grupo = this.fb.group({
      id_Producto: [prod.id_producto, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [prod.precioVenta],
      stock: [prod.stock],
    });

    grupo.get('id_Producto')?.valueChanges.subscribe((id: number | null) => {
      if (id != null) {
        const producto = this.productos.find((p) => p.id_producto === +id);
        if (producto) {
          grupo.patchValue(
            {
              precio: producto.precioVenta,
              stock: producto.stock,
            },
            { emitEvent: false }
          );
          this.calcularTotales();
        }
      }
    });

    grupo.get('cantidad')?.valueChanges.subscribe(() => this.calcularTotales());

    this.detalles.push(grupo);
    this.calcularTotales();
  }

  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
    this.calcularTotales();
  }

  calcularTotales() {
    let subtotal = 0;
    for (let group of this.detalles.controls) {
      const cantidad = +group.get('cantidad')?.value;
      const precio = +group.get('precio')?.value;
      subtotal += cantidad * precio;
    }

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    this.subTotal.set(subtotal);
    this.igv.set(igv);
    this.total.set(total);
  }

  guardarVenta() {
    const errores: string[] = [];

    for (const grupo of this.detalles.controls) {
      const stock = +grupo.get('stock')?.value;
      const cantidad = +grupo.get('cantidad')?.value;
      if (cantidad > stock) {
        errores.push('Cantidad no puede superar el stock disponible.');
      }
    }

    if (errores.length > 0) {
      alert(errores.join('\n'));
      return;
    }
    if (this.formVenta.invalid) {
      alert('Formulario inválido');
      return;
    }

    const compra: VentaRequest = {
      detalles: this.detalles.value.map((d: any) => ({
        id_Producto: d.id_Producto,
        cantidad: d.cantidad,
        costo: d.costo,
        precio: d.costo, // se calcula el precio de venta
      })),
    };

    this.ventaService.registrarVenta(compra).subscribe({
      next: (resp) => {
        alert('Compra registrada con éxito');
        console.log('Respuesta:', resp);
        this.formVenta.reset();
        this.detalles.clear();
        this.agregarDetalle();
        this.cargarProductosConStock(true);
      },
      error: (err) => {
        console.error(' Error al registrar la compra', err);
        alert('Error al registrar la compra');
      },
    });
  }
}
