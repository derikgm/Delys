import { DulceCatalogo } from '../modelos/dulces.modelo';

/** Dominio de GitHub Pages donde se publica el sitio. */
const DOMINIO_PUBLICACION = 'derikgm.github.io';

/** Carpeta del repositorio dentro de GitHub Pages. */
const CARPETA_REPOSITORIO = 'Delys';

/** Prefijo para reconstruir una imagen que el backend manda en base64. */
const PREFIJO_IMAGEN_BASE64 = 'data:image/jpeg;base64,';

/**
 * Construye la URL de una imagen de `src/assets`.
 * En GitHub Pages se antepone `/Delys/` porque el sitio se sirve en un subdirectorio.
 */
export function obtenerUrlImagen(nombreImagen: string): string {
  const nombre = nombreImagen.endsWith('.jpg') ? nombreImagen : `${nombreImagen}.jpg`;

  if (esModoDesarrollo()) {
    return `/assets/${nombre}`;
  }

  return `/${CARPETA_REPOSITORIO}/assets/${nombre}`;
}

/** `true` si la app se está ejecutando fuera de GitHub Pages (ng serve, localhost). */
export function esModoDesarrollo(): boolean {
  return window.location.hostname !== DOMINIO_PUBLICACION;
}

/**
 * Decide de dónde sale la imagen de un dulce del catálogo.
 * Se usa la dirección que da el backend; si no hay, se reconstruye la imagen a
 * partir de los bytes en base64 y, si tampoco los hay, se recurre al archivo de
 * `src/assets` que lleva el nombre del dulce.
 */
export function resolverImagenDulce(dulce: DulceCatalogo): string {
  const url = dulce.imagen_url?.trim();

  if (url) {
    return url;
  }

  const bytes = dulce.imagen_bytes?.trim();

  if (bytes) {
    return bytes.startsWith('data:') ? bytes : `${PREFIJO_IMAGEN_BASE64}${bytes}`;
  }

  return obtenerUrlImagen(dulce.nombre);
}
