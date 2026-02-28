import { EmpleadoResumen } from './empleado.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  empleado: EmpleadoResumen;
}

export interface AuthState {
  token: string | null;
  empleado: EmpleadoResumen | null;
}
