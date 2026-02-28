export interface ParametroOperativo {
  id: string;
  clave: string;
  valor: string;
  descripcion: string;
  tipo: 'string' | 'number' | 'boolean';
}
