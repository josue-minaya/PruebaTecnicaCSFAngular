import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CompraRequest,
  CompraResponseR,
} from '../Models/RegistrarCompra.interface';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private baseUrl = 'https://localhost:7002/api/compras';
  private http = inject(HttpClient);

  registrarCompra(detalle: CompraRequest): Observable<CompraResponseR> {
    const url = `${this.baseUrl}/Registrar`;
    console.log(detalle.detalles);
    return this.http.post<CompraResponseR>(url, detalle);
  }
}
