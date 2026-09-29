export interface Dulce {
  id: number;
  precio: number;
  nombre: string;
  rebaja?: number;
  imagen?: string;
}

export interface Encargo {
  dulce: Dulce;
  cantidad: number;
}

/** Datos que el cliente envía al confirmar un pedido. */
export interface DatosPedido {
  direccion: string;
  telefono: string;
  fecha: string;
  horario: string;
  notas: string;
  encargos: Encargo[];
  total: number;
  fechaFormateada: string | null;
}

export interface FranjaHoraria {
  valor: string;
  etiqueta: string;
  icono: string;
}

export interface FechaRapida {
  etiqueta: string;
  dias: number;
}
