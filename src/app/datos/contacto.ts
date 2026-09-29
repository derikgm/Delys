/**
 * Datos de contacto de Delys.
 * Centralizados aquí para que el botón de WhatsApp, la sección de contacto
 * y el diálogo de pedido no tengan el número escrito a mano en varios lados.
 */

/** Número de WhatsApp, sin prefijo internacional. */
export const numeroContacto = '55905717';

/** Texto con el que se abre la conversación en WhatsApp. */
export const mensajeContacto = 'Hola Delys, quiero encargar un dulce';

/** Correo de la repostería. */
export const correoContacto = 'reposteria.delyss@gmail.com';

/** Prefijo internacional para mostrar y llamar por teléfono. */
export const prefijoTelefono = '+53';

/** Número tal como se muestra en pantalla. */
export const telefonoVisible = `${prefijoTelefono} ${numeroContacto}`;

/** Enlace `tel:` para el botón de llamada. */
export const telefonoLink = `tel:${prefijoTelefono}${numeroContacto}`;

/** Enlace `mailto:`. */
export const correoLink = `mailto:${correoContacto}`;

/** Enlace de WhatsApp con el mensaje inicial ya codificado. */
export const contactoLink = `https://wa.me/${numeroContacto}?text=${encodeURIComponent(mensajeContacto)}`;
