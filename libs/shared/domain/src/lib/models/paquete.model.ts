import { ProductoDetalle } from './producto.model';

export interface PaqueteDetalle extends ProductoDetalle {
  componentes: ComponentePaquete[];
}

export interface ComponentePaquete {
  productoId: string;
  productoNombre: string;
  cantidad: number;
}
