import { Disponibilidad } from '../enums/disponibilidad.enum';
import { TipoMovimiento } from '../enums/tipo-movimiento.enum';

export interface StockProducto {
  productoId: string;
  cantidadDisponible: number;
  cantidadReservada: number;
  disponibilidad: Disponibilidad;
}

export interface MovimientoInventario {
  id: string;
  productoId: string;
  productoNombre: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
  fecha: string;
}
