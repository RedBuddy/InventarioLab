
export interface IEquipo {
  id?: number;
  nombre: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  alimentacion?: string;
  amperaje?: string;
  frecuencia?: string;
  potencia?: string;
  proyecto?: string;
  ubicacion?: string;
  imagen?: {
    type: string;
    data: number[];
  };
  estado: 'activo' | 'inactivo' | 'mantenimiento';
}