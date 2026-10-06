import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { resolverImagenDulce } from '../comunes/imagenes';
import { urlApi } from '../datos/api';
import { DatosPedido, Dulce, DulceCatalogo, Encargo } from '../modelos/dulces.modelo';

@Injectable({ providedIn: 'root' })
export class ServicioEncargos {
  private readonly http = inject(HttpClient);

  readonly cargandoDulces = signal(true);
  readonly tiposDeDulces = signal<Dulce[]>([]);
  readonly encargos = signal<Encargo[]>([]);

  /** `true` mientras un pedido viaja al backend. */
  readonly enviandoPedido = signal(false);
  /** Mensaje de error del último envío, o `null` si no hubo. */
  readonly errorPedido = signal<string | null>(null);
  /** `true` en cuanto el backend confirma un pedido. */
  readonly pedidoEnviado = signal(false);

  /** Descarga el catálogo de dulces y le asigna a cada uno su imagen. */
  init(): void {
    this.http.get<{ dulces: DulceCatalogo[] }>(`${urlApi}/dulces`).subscribe({
      next: (respuesta) => {
        // Mientras el backend no esté listo puede contestar sin la lista de dulces;
        // se trata como un catálogo vacío en vez de romper el arranque.
        const dulces = respuesta?.dulces ?? [];
        this.tiposDeDulces.set(dulces.map((dulce) => this.aDulceVisible(dulce)));
        this.cargandoDulces.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los dulces:', error);
        this.cargandoDulces.set(false);
      },
    });
  }

  /** Cambia la cantidad de un dulce en el encargo indicado. */
  cambiarCantidad(indiceEncargo: number, nuevaCantidad: number): void {
    this.encargos.update((encargos) =>
      encargos.map((encargo, indice) =>
        indice === indiceEncargo ? { ...encargo, cantidad: nuevaCantidad } : encargo,
      ),
    );
  }

  /** Sustituye el dulce del encargo indicado por otro del catálogo. */
  cambiarDulce(indiceEncargo: number, dulceId: number): void {
    const dulceSeleccionado = this.tiposDeDulces().find((dulce) => dulce.id === dulceId);

    if (!dulceSeleccionado) {
      return;
    }

    this.encargos.update((encargos) =>
      encargos.map((encargo, indice) =>
        indice === indiceEncargo ? { ...encargo, dulce: dulceSeleccionado } : encargo,
      ),
    );
  }

  /** Agrega un encargo con el primer dulce del catálogo. */
  agregarEncargo(): void {
    const primerDulce = this.tiposDeDulces()[0];

    if (!primerDulce) {
      return;
    }

    this.encargos.update((encargos) => [...encargos, { dulce: primerDulce, cantidad: 1 }]);
  }

  /** Elimina el encargo que ocupa la posición indicada. */
  eliminarEncargo(indiceEncargo: number): void {
    this.encargos.update((encargos) => encargos.filter((_, indice) => indice !== indiceEncargo));
  }

  /** Vacía el pedido actual. */
  limpiarEncargos(): void {
    this.encargos.set([]);
  }

  /** Envía el pedido a `POST /delys/pedido` y vacía el pedido si el backend lo acepta. */
  enviarPedido(datos: DatosPedido): void {
    this.enviandoPedido.set(true);
    this.errorPedido.set(null);

    this.http.post(`${urlApi}/pedido`, datos).subscribe({
      next: () => {
        this.enviandoPedido.set(false);
        this.pedidoEnviado.set(true);
        this.limpiarEncargos();
      },
      error: (error) => {
        console.error('Error al enviar el pedido:', error);
        this.enviandoPedido.set(false);
        this.errorPedido.set(
          'No pudimos enviar tu pedido. Revisa tu conexión e inténtalo de nuevo.',
        );
      },
    });
  }

  /** Pasa un dulce del backend al formato que usan las vistas. */
  private aDulceVisible(dulce: DulceCatalogo): Dulce {
    return {
      id: dulce.id,
      nombre: dulce.nombre,
      precio: dulce.precio,
      // Si el servidor estuviera en una versión anterior a la columna (punto 5)
      // no mandaría moneda: se pinta `CUP`, que es como se veía hasta ahora.
      moneda: dulce.moneda || 'CUP',
      imagen: resolverImagenDulce(dulce),
    };
  }
}
