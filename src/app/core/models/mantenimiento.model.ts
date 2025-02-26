
export interface IMantenimiento {
  id?: number;
  equipo_id: number;
  fecha_mantenimiento: Date;
  descripcion: string;
  tecnico: string;
}