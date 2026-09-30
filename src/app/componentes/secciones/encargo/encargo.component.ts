import { Component, computed, effect, inject, signal } from '@angular/core';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { matAdd } from '@ng-icons/material-icons/baseline';
import { IndicadorCargaComponent } from '../../../comunes/indicador-carga.component';
import { DatosPedido, Dulce } from '../../../modelos/dulces.modelo';
import { ServicioEncargos } from '../../../servicios/encargo.servicio';
import { TarjetaEncargoComponent } from './componentes/tarjeta-encargo.component';
import { ValidarEncargoComponent } from './componentes/validar-encargo.component';
import { SelectorDulceComponent } from './componentes/selector-dulce.component';

@Component({
  selector: 'app-encargo',
  standalone: true,
  providers: [
    provideIcons({
      agregar: matAdd,
    }),
  ],
  templateUrl: './encargo.component.html',
  imports: [
    NgIcon,
    IndicadorCargaComponent,
    TarjetaEncargoComponent,
    ValidarEncargoComponent,
    SelectorDulceComponent,
  ],
})
export class EncargoComponent {
  private readonly servicioEncargos = inject(ServicioEncargos);

  readonly encargos = this.servicioEncargos.encargos;
  readonly cargandoDulces = this.servicioEncargos.cargandoDulces;
  readonly enviandoPedido = this.servicioEncargos.enviandoPedido;
  readonly errorPedido = this.servicioEncargos.errorPedido;
  readonly pedidoEnviado = this.servicioEncargos.pedidoEnviado;

  readonly mostrarDialogo = signal(false);
  readonly mostrarSelector = signal(false);
  readonly indiceParaSelector = signal<number | null>(null);

  /** Suma de todos los dulces × cantidad. */
  readonly precioTotal = computed(() =>
    this.encargos().reduce((total, encargo) => total + encargo.dulce.precio * encargo.cantidad, 0),
  );

  /** Dulce del encargo que se está editando en el selector, si hay alguno. */
  readonly dulceEnEdicion = computed(() => {
    const indice = this.indiceParaSelector();
    return indice === null ? null : (this.encargos()[indice]?.dulce ?? null);
  });

  /** Mensaje de error si el pedido no es válido, o `null` si sí lo es. */
  readonly errorValidacion = computed(() => {
    const encargos = this.encargos();

    if (encargos.length === 0) {
      return 'Debes agregar al menos un dulce';
    }

    if (encargos.some((encargo) => encargo.cantidad <= 0)) {
      return 'Todos los dulces deben tener una cantidad mayor a 0';
    }

    return null;
  });

  /** Clases de la cuadrícula según cuántos encargos hay. */
  readonly clasesCuadricula = computed(() => {
    const total = this.encargos().length;

    if (total <= 1) {
      return 'flex justify-center w-full';
    }

    if (total < 4) {
      return 'grid grid-cols-1 sm:grid-cols-2 gap-4';
    }

    return 'grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 sm:grid-cols-2';
  });

  agregarEncargo(): void {
    // Al arrancar un pedido nuevo se apaga el aviso del pedido anterior.
    this.servicioEncargos.pedidoEnviado.set(false);
    this.servicioEncargos.agregarEncargo();
  }

  eliminarEncargo(indice: number): void {
    this.servicioEncargos.eliminarEncargo(indice);
  }

  abrirDialogo(): void {
    if (this.errorValidacion()) {
      return;
    }

    this.mostrarDialogo.set(true);
  }

  cerrarDialogo(): void {
    this.mostrarDialogo.set(false);
  }

  abrirSelector(indice: number): void {
    this.indiceParaSelector.set(indice);
    this.mostrarSelector.set(true);
  }

  cerrarSelector(): void {
    this.mostrarSelector.set(false);
    this.indiceParaSelector.set(null);
  }

  seleccionarDulce(dulce: Dulce): void {
    const indice = this.indiceParaSelector();

    if (indice !== null) {
      this.servicioEncargos.cambiarDulce(indice, dulce.id);
    }

    this.cerrarSelector();
  }

  constructor() {
    // Si el backend confirma el pedido, el diálogo se cierra solo.
    effect(() => {
      if (this.servicioEncargos.pedidoEnviado()) {
        this.cerrarDialogo();
      }
    });
  }

  confirmarPedido(datos: DatosPedido): void {
    this.servicioEncargos.enviarPedido(datos);
  }
}
