import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matDelete, matEdit } from '@ng-icons/material-icons/baseline';
import { Encargo } from '../../../../modelos/dulces.modelo';
import { ServicioEncargos } from '../../../../servicios/encargo.servicio';

@Component({
  selector: 'app-tarjeta-encargo',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      editar: matEdit,
      eliminar: matDelete,
    }),
  ],
  template: `
    <div
      class="flex flex-col overflow-hidden mt-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <!-- Imagen previa: al hacer clic se abre el selector de dulces -->
      <button
        type="button"
        (click)="solicitarCambioDulce.emit()"
        [attr.aria-label]="'Cambiar dulce: ' + encargo().dulce.nombre"
        class="w-full bg-gray-100 flex items-center justify-center
               border-2 rounded-t-xl border-gray-200 aspect-square relative group cursor-pointer
               hover:border-delys-primary transition-colors duration-300 overflow-hidden"
      >
        @if (encargo().dulce.imagen) {
          <img
            [src]="encargo().dulce.imagen"
            [alt]="encargo().dulce.nombre"
            class="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
          />
        } @else {
          <p class="text-gray-400 text-sm select-none aspect-square items-center flex">🍬</p>
        }

        <div
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                 flex items-center justify-center"
        >
          <div class="bg-white/90 rounded-full p-3 shadow-lg">
            <ng-icon name="editar" class="text-2xl text-delys-primary" />
          </div>
        </div>

        <div
          class="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white
                 text-xs py-1 px-2 rounded-md text-center truncate"
        >
          {{ encargo().dulce.nombre }}
        </div>
      </button>

      <!-- Controles del encargo -->
      <div class="flex flex-col p-4 bg-white">
        <div class="flex items-center justify-between mb-3">
          <label class="font-medium text-gray-700 select-none" for="cantidad-{{ indice() }}">
            Cantidad
          </label>
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="disminuirCantidad()"
              [disabled]="encargo().cantidad <= 1"
              aria-label="Disminuir cantidad"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40
                     flex items-center justify-center font-bold text-gray-600 transition-colors
                     cursor-pointer select-none"
            >
              −
            </button>
            <input
              id="cantidad-{{ indice() }}"
              type="number"
              min="1"
              [value]="encargo().cantidad"
              class="w-16 text-center border-2 border-gray-200 rounded-lg py-1 outline-none
                     focus:border-delys-primary transition-colors"
              (input)="alCambiarCantidad($event)"
            />
            <button
              type="button"
              (click)="aumentarCantidad()"
              aria-label="Aumentar cantidad"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center
                     font-bold text-gray-600 transition-colors cursor-pointer select-none"
            >
              +
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Precio unitario:</span>
            <span class="font-semibold text-delys-primary">{{ encargo().dulce.precio }} CUP</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Total:</span>
            <span class="font-bold text-delys-primary text-lg"> {{ total() }} CUP </span>
          </div>
        </div>

        <button
          type="button"
          (click)="solicitarEliminar.emit()"
          class="mt-3 flex items-center justify-center gap-2 text-sm text-red-600
                 hover:text-red-800 transition-colors cursor-pointer"
        >
          <ng-icon name="eliminar" class="text-lg" />
          <span>Quitar este dulce</span>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaEncargoComponent {
  readonly indice = input.required<number>();
  readonly encargo = input.required<Encargo>();

  readonly solicitarCambioDulce = output<void>();
  readonly solicitarEliminar = output<void>();

  private readonly servicioEncargos = inject(ServicioEncargos);

  total(): number {
    const encargo = this.encargo();
    return encargo.dulce.precio * encargo.cantidad;
  }

  alCambiarCantidad(evento: Event): void {
    const valor = Number((evento.target as HTMLInputElement).value);
    this.servicioEncargos.cambiarCantidad(this.indice(), Number.isNaN(valor) ? 1 : valor);
  }

  disminuirCantidad(): void {
    const cantidad = this.encargo().cantidad;

    if (cantidad > 1) {
      this.servicioEncargos.cambiarCantidad(this.indice(), cantidad - 1);
    }
  }

  aumentarCantidad(): void {
    this.servicioEncargos.cambiarCantidad(this.indice(), this.encargo().cantidad + 1);
  }
}
