import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Categoria } from '@retail/shared/domain';

import { API_BASE_URL } from '../../tokens/api-config.token';

@Injectable({ providedIn: 'root' })
export class CategoriasApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/catalogo/categorias`);
  }

  obtenerPorId(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/catalogo/categorias/${id}`);
  }

  crear(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}/catalogo/categorias`, categoria);
  }

  actualizar(id: string, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.baseUrl}/catalogo/categorias/${id}`, categoria);
  }
}
