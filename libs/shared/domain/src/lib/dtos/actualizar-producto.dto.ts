export interface ActualizarProductoDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoriaId?: string;
  esElegibleParaCambio?: boolean;
  imagenes?: string[];
}
