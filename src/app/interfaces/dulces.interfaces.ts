export interface Dulce {
  precio: number,
  nombre: string,
  rebaja?: number,
  imagen?: string,
}

export interface Encargo {
  dulce: Dulce,
  cantidad: number,
}