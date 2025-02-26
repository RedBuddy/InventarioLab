
export interface IUsuario {
  id?: number;
  nombre: string;
  email: string;
  contraseña: string;
  rol: 'admin' | 'mod' | 'usuario';
  imagen?: {
    type: string;
    data: number[];
  };
  activo: boolean;
  fecha_registro?: Date;
}