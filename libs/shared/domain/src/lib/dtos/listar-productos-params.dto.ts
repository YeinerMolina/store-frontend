import { Disponibilidad } from '../enums/disponibilidad.enum';

export interface ListarProductosParams {
  page?: number;
  pageSize?: number;
  categoriaId?: string;
  disponibilidad?: Disponibilidad;
  precioMin?: number;
  precioMax?: number;
  busqueda?: string;
  ordenarPor?: 'precio' | 'nombre' | 'reciente';
  ordenDireccion?: 'asc' | 'desc';
}
