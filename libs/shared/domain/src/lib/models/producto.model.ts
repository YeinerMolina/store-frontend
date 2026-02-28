import { Disponibilidad } from '../enums/disponibilidad.enum';
import { EstadoProducto } from '../enums/estado-producto.enum';

export interface ProductoResumen {
  id: string;
  nombre: string;
  precio: number;
  imagenPrincipal: string | null;
  categoriaId: string;
  categoriaNombre: string;
  estado: EstadoProducto;
  disponibilidad: Disponibilidad;
  esPaquete: boolean;
}

export interface ProductoDetalle extends ProductoResumen {
  descripcion: string;
  imagenes: string[];
  esElegibleParaCambio: boolean;
  createdAt: string;
  updatedAt: string;
}
