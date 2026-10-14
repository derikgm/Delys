import { Component, inject } from '@angular/core';
import { IndicadorCargaComponent } from '../../comunes/indicador-carga.component';
import { ServicioCombos } from '../../servicios/combos.servicio';

/**
 * Sección «Combos» del inicio: las ofertas de varios dulces juntos por un precio
 * (todo.md, punto 3). Cada combo se pinta como una tarjeta con su imagen, su
 * precio y la lista de dulces con la cantidad de cada uno.
 */
@Component({
  selector: 'app-combos',
  standalone: true,
  imports: [IndicadorCargaComponent],
  templateUrl: './combos.component.html',
})
export class CombosComponent {
  private readonly servicioCombos = inject(ServicioCombos);

  readonly cargandoCombos = this.servicioCombos.cargandoCombos;
  readonly combos = this.servicioCombos.combos;

  constructor() {
    this.servicioCombos.init();
  }
}
