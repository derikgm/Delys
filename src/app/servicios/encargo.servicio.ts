import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { resolverImagenDulce } from '../comunes/imagenes';
import { urlApi } from '../datos/api';
import { Dulce, DulceCatalogo, Encargo } from '../modelos/dulces.modelo';

@Injectable({ providedIn: 'root' })
export class ServicioEncargos {
  private readonly http = inject(HttpClient);

  readonly cargandoDulces = signal(true);
  readonly tiposDeDulces = signal<Dulce[]>([]);
  readonly encargos = signal<Encargo[]>([]);

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

  /** Pasa un dulce del backend al formato que usan las vistas. */
  private aDulceVisible(dulce: DulceCatalogo): Dulce {
    return {
      id: dulce.id,
      nombre: dulce.nombre,
      precio: dulce.precio,
      imagen: resolverImagenDulce(dulce),
    };
  }
}
