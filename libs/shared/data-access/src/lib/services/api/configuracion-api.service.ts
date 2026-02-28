import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParametroOperativo } from '@retail/shared/domain';

import { API_BASE_URL } from '../../tokens/api-config.token';

@Injectable({ providedIn: 'root' })
export class ConfiguracionApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listarParametros(): Observable<ParametroOperativo[]> {
    return this.http.get<ParametroOperativo[]>(`${this.baseUrl}/configuracion/parametros`);
  }

  actualizarParametro(
    id: string,
    valor: string
  ): Observable<ParametroOperativo> {
    return this.http.patch<ParametroOperativo>(
      `${this.baseUrl}/configuracion/parametros/${id}`,
      { valor }
    );
  }
}
