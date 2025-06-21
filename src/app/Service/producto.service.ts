import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VentaResponse } from '../Models/ListaVentas.interface';
import { ProductoResponse } from '../Models/ListaProducto.interface';
import { ProductoCrear } from '../Models/RegistrarProducto.interface';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private baseUrl = 'https://localhost:7004/api/Productos';
  private http = inject(HttpClient);

  getListaproductos(): Observable<ProductoResponse> {
    const url = `${this.baseUrl}`;
    return this.http.get<ProductoResponse>(url);
  }

  registrarProducto(producto: ProductoCrear): Observable<any> {
    return this.http.post(`${this.baseUrl}/Registrar`, producto);
  }
}
