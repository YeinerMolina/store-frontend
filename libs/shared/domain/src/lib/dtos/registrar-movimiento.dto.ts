import { TipoMovimiento } from '../enums/tipo-movimiento.enum';

export interface RegistrarMovimientoDto {
  productoId: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
}
