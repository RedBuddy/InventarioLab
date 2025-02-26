
export interface IMovimiento {
  id?: number;
  tipo: 'entrada' | 'salida';
  reactivo_id: number;
  cantidad: number;
  unidad_medida: string;
  fecha_movimiento?: Date;
  usuario_id: number;
}