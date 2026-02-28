import { Injectable, computed, signal } from '@angular/core';
import { EmpleadoResumen } from '@retail/shared/domain';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _token = signal<string | null>(null);
  private readonly _empleado = signal<EmpleadoResumen | null>(null);

  readonly token = this._token.asReadonly();
  readonly empleado = this._empleado.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly nombreEmpleado = computed(() => this._empleado()?.nombre ?? '');

  setAuth(token: string, empleado: EmpleadoResumen): void {
    this._token.set(token);
    this._empleado.set(empleado);
  }

  clearAuth(): void {
    this._token.set(null);
    this._empleado.set(null);
  }
}
