import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CrearPaqueteDto, PaqueteDetalle } from '@retail/shared/domain';

import { API_BASE_URL } from '../../tokens/api-config.token';

@Injectable({ providedIn: 'root' })
export class PaquetesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  obtenerPorId(id: string): Observable<PaqueteDetalle> {
    return this.http.get<PaqueteDetalle>(`${this.baseUrl}/catalogo/paquetes/${id}`);
  }

  crear(dto: CrearPaqueteDto): Observable<PaqueteDetalle> {
    return this.http.post<PaqueteDetalle>(`${this.baseUrl}/catalogo/paquetes`, dto);
  }

  actualizar(id: string, dto: Partial<CrearPaqueteDto>): Observable<PaqueteDetalle> {
    return this.http.patch<PaqueteDetalle>(`${this.baseUrl}/catalogo/paquetes/${id}`, dto);
  }
}
