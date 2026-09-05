export interface Dulce {
  id: number,
  precio: number,
  nombre: string,
  rebaja?: number,
  imagen?: string,
}

export interface Encargo {
  dulce: Dulce,
  cantidad: number,
}