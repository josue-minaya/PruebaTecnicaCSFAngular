import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VentaResponse } from '../Models/ListaVentas.interface';
import {
  DetalleVentaCommpra,
  VentaRequest,
  VentaResponseR,
} from '../Models/RegistrarVenta.interface';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private baseUrl = 'https://localhost:7001/api/ventas';
  private http = inject(HttpClient);

  registrarVenta(detalle: VentaRequest): Observable<VentaResponseR> {
    const url = `${this.baseUrl}/Registrar`;
    return this.http.post<VentaResponseR>(url, detalle);
  }
}
