import { esModoDesarrollo } from '../comunes/imagenes';

/** Backend local, para cuando se levanta en la máquina con `npm start`. */
const API_DESARROLLO = 'http://localhost:3000/delys';

/** Backend público usado en GitHub Pages. */
const API_PRODUCCION = 'https://derikgm-msf-nestjs.wasmer.app/delys';

/** URL base de la API según el entorno donde corre la aplicación. */
export const urlApi = esModoDesarrollo() ? API_DESARROLLO : API_PRODUCCION;
