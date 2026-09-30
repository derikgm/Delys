/**
 * Un dulce tal como lo devuelve `GET /delys/dulces`.
 * Las propiedades van en `snake_case` porque es el nombre que usa el backend.
 */
export interface DulceCatalogo {
  id: number;
  precio: number;
  nombre: string;
  /** Dirección de la imagen. El backend puede enviarla como `null`. */
  imagen_url: string | null;
  /** Imagen en base64, para cuando no hay dónde alojarla. Puede ser `null`. */
  imagen_bytes: string | null;
}

/** Dulce ya preparado para las vistas, con la imagen resuelta. */
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
