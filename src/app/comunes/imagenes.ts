/** Dominio de GitHub Pages donde se publica el sitio. */
const DOMINIO_PUBLICACION = 'derikgm.github.io';

/** Carpeta del repositorio dentro de GitHub Pages. */
const CARPETA_REPOSITORIO = 'Delys';

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
