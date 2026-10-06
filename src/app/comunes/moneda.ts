/**
 * Ayudas sobre la moneda que el backend devuelve en el catálogo (punto 5).
 *
 * La base guarda un texto corto — `CUP`, `USD`… — y no un enum, así que aquí no
 * se convierte nada: solo se decide qué escribir junto a una suma.
 */

/**
 * Lo que se pega al lado de un total: la moneda si todos los renglones la
 * comparten, y el aviso si se mezclan.
 *
 * Mezclar monedas es posible (cada producto lleva la suya) y el backend suma
 * `precio × cantidad` **sin convertir**, así que el número que se ve es el mismo
 * que él guarda en `pedido.precio_total`. Lo que no se puede es etiquetarlo como
 * `CUP` si en realidad hay dólares dentro.
 */
export function monedaDeLaSuma(monedas: Iterable<string>): string {
  const conjunto = new Set(monedas);
  if (conjunto.size > 1) {
    return 'monedas distintas';
  }
  // Sin renglones (o con uno solo) no hay nada que mezclar: el catálogo arranca en CUP.
  return [...conjunto][0] ?? 'CUP';
}
