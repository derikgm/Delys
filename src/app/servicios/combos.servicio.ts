import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { resolverImagenCombo } from '../comunes/imagenes';
import { urlApi } from '../datos/api';
import { Combo, ComboCatalogo } from '../modelos/dulces.modelo';

/**
 * Descarga los combos que ofrece la pastelería desde `GET /delys/combos`.
 *
 * Mismo patrón que `ServicioEncargos`: la lista se guarda en una señal y el
 * indicador de carga se apaga tanto si llega bien como si falla. Un combo sin
 * dulces o una respuesta vacía no rompen la vista.
 */
@Injectable({ providedIn: 'root' })
export class ServicioCombos {
  private readonly http = inject(HttpClient);

  readonly cargandoCombos = signal(true);
  readonly combos = signal<Combo[]>([]);

  /** Descarga los combos y resuelve la imagen de cada uno. */
  init(): void {
    this.http.get<{ combos: ComboCatalogo[] }>(`${urlApi}/combos`).subscribe({
      next: (respuesta) => {
        // El backend puede contestar sin la lista: se trata como vacía.
        const combos = respuesta?.combos ?? [];
        this.combos.set(combos.map((combo) => this.aComboVisible(combo)));
        this.cargandoCombos.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los combos:', error);
        this.cargandoCombos.set(false);
      },
    });
  }

  /** Pasa un combo del backend al formato que usan las vistas. */
  private aComboVisible(combo: ComboCatalogo): Combo {
    return {
      id: combo.id,
      nombre_combo: combo.nombre_combo,
      precio: combo.precio,
      // Si el servidor no mandara moneda, se pinta `CUP`, como en los dulces.
      moneda: combo.moneda || 'CUP',
      imagen: resolverImagenCombo(combo),
      dulces: combo.dulces ?? [],
    };
  }
}
