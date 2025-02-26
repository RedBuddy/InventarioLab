
export interface IReactivo {
  id: number;
  clave?: string;
  cas?: string;
  numero?: string;
  nombre: string;
  pureza?: string;
  cantidad_total: number;
  unidad_medida: string;
  categoria_id: number;
  estado: 'disponible' | 'agotado' | 'en_uso';
}