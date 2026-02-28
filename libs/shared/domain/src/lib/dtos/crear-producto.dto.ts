export interface CrearProductoDto {
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaId: string;
  esElegibleParaCambio: boolean;
  imagenes?: string[];
}
