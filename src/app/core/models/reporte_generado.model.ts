export interface IReporteGenerado {
  id: number;
  tipo: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  fechaGeneracion: Date;
  usuarioId: number;
}