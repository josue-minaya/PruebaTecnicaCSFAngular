import { ModalMovimientoComponent } from './../modal-movimiento/modal-movimiento.component';
import { Component, inject, signal } from '@angular/core';
import { MovimientoCab } from '../../../Models/ListaMovimiento.interface';
import { MovimientoService } from '../../../Service/movimiento.service';
import { ProductoService } from '../../../Service/producto.service';
import { Producto } from '../../../Models/ListaProducto.interface';
import { MovimientoProducto } from '../../../Models/ListaMovimientoProducto.interface';

import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movimiento-page',
  imports: [CommonModule, ModalMovimientoComponent],
  templateUrl: './movimiento-page.component.html',
  styleUrl: './movimiento-page.component.css',
})
export default class MovimientoPageComponent {
  movimientos: MovimientoCab[] = [];
  productos: Producto[] = [];
  listaProductos = signal<(Producto & { stock: number })[]>([]);
  movimientoService = inject(MovimientoService);
  productoService = inject(ProductoService);
  lista: MovimientoProducto[] = [];
  ngOnInit() {
    forkJoin({
      productos: this.productoService.getListaproductos(),
      movimientos: this.movimientoService.getListaMovimiento(), // si quieres solo entradas, o crea otro endpoint
    }).subscribe({
      next: ({ productos, movimientos }) => {
        this.productos = productos.data;
        this.movimientos = movimientos.data;
        this.listafinal(); // ahora sí: ya tienes los datos
      },
      error: (err) => console.error('Error al cargar datos', err),
    });
  }

  listarProducto(): void {
    this.productoService.getListaproductos().subscribe({
      next: (resp) => (this.productos = resp.data),
      error: (err) => console.error('Error cargando los productos', err),
    });
  }
  listarMovimientos(): void {
    this.movimientoService.getListaMovimiento().subscribe({
      next: (resp) => (this.movimientos = resp.data),
      error: (err) => console.error('Error cargando los productos', err),
    });
  }

  listafinal(): void {
    const stockMap = new Map<number, number>();

    for (const movimiento of this.movimientos) {
      for (const detalle of movimiento.detalles) {
        const id = detalle.id_Producto;
        const cantidad = detalle.cantidad;
        const signo = movimiento.id_TipoMovimiento === 'ENTRADA' ? 1 : -1;

        const stockActual = stockMap.get(id) || 0;
        stockMap.set(id, stockActual + cantidad * signo);
      }
    }
    this.listaProductos.set(
      this.productos.map((p) => ({
        ...p,
        stock: stockMap.get(p.id_producto) || 0,
      }))
    );
  }

  getMovimientosPorProducto(id_producto: number) {
    const movimientosProducto: MovimientoProducto[] = [];

    for (const movimiento of this.movimientos) {
      for (const detalle of movimiento.detalles) {
        if (detalle.id_Producto === id_producto) {
          movimientosProducto.push({
            fecha: movimiento.fec_Registro,
            cantidad: detalle.cantidad,
            tipo: movimiento.id_TipoMovimiento,
          });
        }
      }
    }

    return movimientosProducto;
  }

  modalVisible = signal(false);
  modalData = signal<MovimientoProducto[]>([]);

  verDetalle(id_producto: number) {
    this.lista = this.getMovimientosPorProducto(id_producto);
    this.modalData.set(this.lista);
    this.modalVisible.set(true);
  }

  cerrarModal() {
    this.modalVisible.set(false);
  }
}
