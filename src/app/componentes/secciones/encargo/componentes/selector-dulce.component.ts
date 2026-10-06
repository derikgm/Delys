import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matClose, matSearch } from '@ng-icons/material-icons/baseline';
import { Dulce } from '../../../../modelos/dulces.modelo';
import { ServicioEncargos } from '../../../../servicios/encargo.servicio';

@Component({
  selector: 'app-selector-dulce',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      cerrar: matClose,
      buscar: matSearch,
    }),
  ],
  template: `
    @if (visible()) {
      <!-- Fondo oscurecido: al hacer clic se cierra -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex
               items-center justify-center p-4"
        (click)="cerrar()"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full
                 max-h-[90vh] overflow-auto animate-slideUp"
          (click)="$event.stopPropagation()"
        >
          <!-- Encabezado -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
            <div>
              <h2 class="text-2xl font-bold text-delys-primary">Selecciona un dulce</h2>
              <p class="text-gray-500 text-sm mt-1">
                Elige el dulce que deseas agregar a tu encargo
              </p>
            </div>
            <button
              type="button"
              (click)="cerrar()"
              aria-label="Cerrar"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ng-icon name="cerrar" class="text-2xl text-gray-600" />
            </button>
          </div>

          <!-- Buscador -->
          <div class="p-4 border-b border-gray-100 shrink-0">
            <div class="relative">
              <ng-icon
                name="buscar"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                #campoBusqueda
                type="text"
                (input)="busqueda.set(campoBusqueda.value)"
                placeholder="Buscar dulce..."
                aria-label="Buscar dulce"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delys-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <!-- Cuadrícula de dulces -->
          <div class="p-6 overflow-y-auto flex-1" style="max-height: calc(90vh - 180px);">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              @for (dulce of dulcesFiltrados(); track dulce.id) {
                <button
                  type="button"
                  (click)="preseleccionar(dulce)"
                  [class.border-delys-primary]="estaSeleccionado(dulce)"
                  class="group cursor-pointer rounded-xl border-2 border-gray-200
                         hover:border-delys-primary transition-all duration-300 overflow-hidden
                         hover:shadow-lg relative text-left"
                >
                  @if (estaSeleccionado(dulce)) {
                    <div
                      class="absolute top-2 right-2 bg-delys-primary text-white rounded-full p-1 z-10 shadow-lg"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  }

                  <div
                    class="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden"
                  >
                    @if (dulce.imagen) {
                      <img
                        [src]="dulce.imagen"
                        [alt]="dulce.nombre"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    } @else {
                      <div
                        class="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200"
                      >
                        <span class="text-4xl">🍬</span>
                      </div>
                    }
                  </div>

                  <div class="p-3">
                    <h3 class="font-semibold text-gray-800 text-sm truncate">{{ dulce.nombre }}</h3>
                    <p class="text-delys-primary font-bold text-sm mt-1">
                      {{ dulce.precio }} {{ dulce.moneda }}
                    </p>
                  </div>
                </button>
              }
            </div>

            @if (dulcesFiltrados().length === 0) {
              <div class="text-center py-12">
                <p class="text-6xl mb-4">🔍</p>
                <p class="text-gray-500 text-lg">No se encontraron dulces</p>
                <p class="text-gray-400 text-sm">Intenta con otra búsqueda</p>
              </div>
            }
          </div>

          <!-- Pie con acciones -->
          <div
            class="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl shrink-0"
          >
            <button
              type="button"
              (click)="cerrar()"
              class="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="confirmarSeleccion()"
              [disabled]="!seleccion()"
              class="px-6 py-2 bg-delys-primary text-white rounded-lg hover:bg-delys-primary/90
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Seleccionar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
    `,
  ],
})
export class SelectorDulceComponent {
  readonly visible = input(false);
  readonly dulceActual = input<Dulce | null>(null);

  readonly dulceSeleccionado = output<Dulce>();
  readonly cerrado = output<void>();

  private readonly tiposDeDulces = inject(ServicioEncargos).tiposDeDulces;

  readonly busqueda = signal('');

  /** Dulce marcado con la insignia; `null` si el usuario no ha elegido ninguno. */
  readonly seleccion = signal<Dulce | null>(null);

  /** `true` si el dulce es el que está marcado con la insignia. */
  estaSeleccionado(dulce: Dulce): boolean {
    return dulce.id === this.seleccion()?.id;
  }

  readonly dulcesFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();

    if (!texto) {
      return this.tiposDeDulces();
    }

    return this.tiposDeDulces().filter((dulce) => dulce.nombre.toLowerCase().includes(texto));
  });

  constructor() {
    // Al abrir el selector, se marca el dulce que ya tenía el encargo.
    effect(() => {
      const actual = this.dulceActual();

      if (actual) {
        this.seleccion.set(actual);
      }
    });
  }

  preseleccionar(dulce: Dulce): void {
    this.seleccion.set(dulce);
  }

  confirmarSeleccion(): void {
    const dulce = this.seleccion();

    if (!dulce) {
      return;
    }

    this.dulceSeleccionado.emit(dulce);
    this.cerrar();
  }

  cerrar(): void {
    this.cerrado.emit();
    this.busqueda.set('');
    this.seleccion.set(null);
  }
}
