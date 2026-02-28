import { HttpParams } from '@angular/common/http';

/** Construye HttpParams omitiendo valores undefined/null */
export function buildHttpParams(params: Record<string, unknown>): HttpParams {
  let httpParams = new HttpParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      httpParams = httpParams.set(key, String(value));
    }
  }
  return httpParams;
}
