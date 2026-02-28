export interface CrearPaqueteDto {
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaId: string;
  componentes: ComponentePaqueteDto[];
}

export interface ComponentePaqueteDto {
  productoId: string;
  cantidad: number;
}
