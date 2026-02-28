import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarProductoDto,
  CrearProductoDto,
  EstadoProducto,
  ListarProductosParams,
  PaginatedResponse,
  ProductoDetalle,
  ProductoResumen,
} from '@retail/shared/domain';
import { buildHttpParams } from '@retail/shared/util';

import { API_BASE_URL } from '../../tokens/api-config.token';

@Injectable({ providedIn: 'root' })
export class ProductosApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listar(params: ListarProductosParams): Observable<PaginatedResponse<ProductoResumen>> {
    const httpParams = buildHttpParams(params as Record<string, unknown>);
    return this.http.get<PaginatedResponse<ProductoResumen>>(
      `${this.baseUrl}/catalogo/productos`,
      { params: httpParams }
    );
  }

  obtenerPorId(id: string): Observable<ProductoDetalle> {
    return this.http.get<ProductoDetalle>(`${this.baseUrl}/catalogo/productos/${id}`);
  }

  crear(dto: CrearProductoDto): Observable<ProductoDetalle> {
    return this.http.post<ProductoDetalle>(`${this.baseUrl}/catalogo/productos`, dto);
  }

  actualizar(id: string, dto: ActualizarProductoDto): Observable<ProductoDetalle> {
    return this.http.patch<ProductoDetalle>(`${this.baseUrl}/catalogo/productos/${id}`, dto);
  }

  cambiarEstado(id: string, estado: EstadoProducto): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/catalogo/productos/${id}/estado`, { estado });
  }
}
