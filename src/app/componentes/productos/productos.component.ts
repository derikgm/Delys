import { Component, computed, inject, signal } from '@angular/core';
import { IndicadorCargaComponent } from '../../comunes/indicador-carga.component';
import { Dulce } from '../../modelos/dulces.modelo';
import { ServicioEncargos } from '../../servicios/encargo.servicio';

/** Dulces visibles antes de pressionar "ver todos". */
const CANTIDAD_INICIAL = 5;

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [IndicadorCargaComponent],
  templateUrl: './productos.component.html',
})
export class ProductosComponent {
  private readonly servicioEncargos = inject(ServicioEncargos);

  readonly cargandoDulces = this.servicioEncargos.cargandoDulces;
  readonly mostrarTodos = signal(false);

  /** Dulces a mostrar según el estado del botón "ver todos". */
  readonly dulcesVisibles = computed<Dulce[]>(() => {
    const dulces = this.servicioEncargos.tiposDeDulces();
    return this.mostrarTodos() ? dulces : dulces.slice(0, CANTIDAD_INICIAL);
  });

  /** `true` si hay dulces ocultos por el botón "ver todos". */
  readonly hayDulcesOcultos = computed(
    () => !this.mostrarTodos() && this.servicioEncargos.tiposDeDulces().length > CANTIDAD_INICIAL,
  );
}
