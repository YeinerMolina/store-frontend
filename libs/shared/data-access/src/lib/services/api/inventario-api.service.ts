import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  MovimientoInventario,
  PaginatedResponse,
  RegistrarMovimientoDto,
  StockProducto,
} from '@retail/shared/domain';
import { buildHttpParams } from '@retail/shared/util';

import { API_BASE_URL } from '../../tokens/api-config.token';

@Injectable({ providedIn: 'root' })
export class InventarioApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  obtenerStock(productoId: string): Observable<StockProducto> {
    return this.http.get<StockProducto>(`${this.baseUrl}/inventario/stock/${productoId}`);
  }

  registrarMovimiento(dto: RegistrarMovimientoDto): Observable<MovimientoInventario> {
    return this.http.post<MovimientoInventario>(
      `${this.baseUrl}/inventario/movimientos`,
      dto
    );
  }

  listarMovimientos(
    params: Record<string, unknown>
  ): Observable<PaginatedResponse<MovimientoInventario>> {
    const httpParams = buildHttpParams(params);
    return this.http.get<PaginatedResponse<MovimientoInventario>>(
      `${this.baseUrl}/inventario/movimientos`,
      { params: httpParams }
    );
  }
}
