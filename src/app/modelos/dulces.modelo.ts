/**
 * Un dulce tal como lo devuelve `GET /delys/dulces`.
 * Las propiedades van en `snake_case` porque es el nombre que usa el backend.
 */
export interface DulceCatalogo {
  id: number;
  precio: number;
  nombre: string;
  /** Moneda del precio (`CUP`, `USD`…). Texto corto, no un enum: puede haber más. */
  moneda: string;
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
  /** Moneda del precio. Ya normalizada: `aDulceVisible()` pone `CUP` si no llega. */
  moneda: string;
  rebaja?: number;
  imagen?: string;
}

export interface Encargo {
  dulce: Dulce;
  cantidad: number;
}

/** Un renglón de un combo: el nombre del dulce y cuántas unidades lleva. */
export interface DulceCombo {
  nombre_dulce: string;
  cantidad: number;
}

/**
 * Un combo tal como lo devuelve `GET /delys/combos`.
 *
 * Los dulces del combo se guardan por **nombre** (no por id): puede ser un dulce
 * del catálogo o uno escrito a mano que no se dio de alta.
 */
export interface ComboCatalogo {
  id: number;
  nombre_combo: string;
  precio: number;
  /** Moneda del precio (`CUP`, `USD`…). Texto corto, no un enum. */
  moneda: string;
  /** Dirección de la imagen; `null` si todavía no tiene foto. */
  imagen_url: string | null;
  dulces: DulceCombo[];
}

/** Combo ya preparado para las vistas, con la imagen resuelta. */
export interface Combo {
  id: number;
  nombre_combo: string;
  precio: number;
  /** Moneda del precio. Ya normalizada: se pone `CUP` si el servidor no la manda. */
  moneda: string;
  /** Imagen resuelta, o `undefined` si el combo no tiene foto. */
  imagen?: string;
  dulces: DulceCombo[];
}

/** Una línea del pedido: qué dulce se pidió y cuántas unidades. */
export interface LineaPedido {
  dulce_id: number;
  cantidad: number;
}

/**
 * Cuerpo de `POST /delys/pedido`.
 * Solo viaja lo que el backend necesita: el precio lo calcula él a partir del
 * catálogo y la imagen no se manda (puede venir en base64 y Pesarían varios MB).
 */
export interface DatosPedido {
  direccion: string;
  telefono: string;
  /** Día de entrega en `YYYY-MM-DD`, ya en la zona horaria del cliente. */
  fecha: string;
  notas: string;
  encargos: LineaPedido[];
}

export interface FechaRapida {
  etiqueta: string;
  dias: number;
}
