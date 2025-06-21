import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MovimientoResponse } from '../Models/ListaMovimiento.interface';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private baseUrl = 'https://localhost:7003/api/movimientos';
  private http = inject(HttpClient);

  getListaMovimiento(): Observable<MovimientoResponse> {
    const url = `${this.baseUrl}`;
    return this.http.get<MovimientoResponse>(url);
  }
}
