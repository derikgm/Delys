// selector-dulce.component.ts
import { Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { matClose, matSearch } from '@ng-icons/material-icons/baseline';
import { provideIcons } from '@ng-icons/core';
import { tipos_de_dulces } from '../../../../common/dulces';
import { Dulce } from '../../../../interfaces/dulces.interfaces';

@Component({
  selector: 'selector-dulce',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      close: matClose,
      search: matSearch,
    })
  ],
  template: `
    @if (visible()) {
      <!-- Overlay -->
        <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex 
        items-center justify-center p-4"
        (click)="cerrar()"
        (scroll)="$event.stopPropagation()"
        style="overflow: hidden;"
      >
        <!-- Modal -->
        <div 
          class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
          (click)="$event.stopPropagation()"
        >
          <!-- Header - fijo -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
            <div>
              <h2 class="text-2xl font-bold text-domus-primary">Selecciona un dulce</h2>
              <p class="text-gray-500 text-sm mt-1">Elige el dulce que deseas agregar a tu encargo</p>
            </div>
            <button 
              (click)="cerrar()"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ng-icon name="close" class="text-2xl text-gray-600" />
            </button>
          </div>

          <!-- Buscador - fijo -->
          <div class="p-4 border-b border-gray-100 shrink-0">
            <div class="relative">
              <ng-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                #searchInput
                type="text"
                (input)="busqueda.set(searchInput.value)"
                placeholder="Buscar dulce..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-domus-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <!-- Grid de dulces - scrollable -->
          <div 
            class="p-6 overflow-y-auto flex-1"
            style="max-height: calc(90vh - 180px);"
            (scroll)="$event.stopPropagation()"
          >
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              @for (dulce of dulcesFiltrados(); track dulce.id) {
                <div
                  (click)="seleccionarDulce(dulce)"
                  class="group cursor-pointer rounded-xl border-2 border-gray-200 hover:border-domus-primary transition-all duration-300 overflow-hidden hover:shadow-lg relative"
                  [class.border-domus-primary]="dulce.id === dulceSeleccionado()?.id"
                >
                  <!-- Badge de seleccionado -->
                  @if (dulce.id === dulceSeleccionado()?.id) {
                    <div class="absolute top-2 right-2 bg-domus-primary text-white rounded-full p-1 z-10 shadow-lg">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  }

                  <!-- Imagen -->
                  <div class="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    @if (dulce.imagen) {
                      <img
                        [src]="dulce.imagen"
                        [alt]="dulce.nombre"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    } @else {
                      <div class="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                        <span class="text-4xl">🍬</span>
                      </div>
                    }
                  </div>

                  <!-- Información -->
                  <div class="p-3">
                    <h3 class="font-semibold text-gray-800 text-sm truncate">{{ dulce.nombre }}</h3>
                    <p class="text-domus-primary font-bold text-sm mt-1">{{ dulce.precio }} CUP</p>
                  </div>
                </div>
              }
            </div>

            <!-- Mensaje cuando no hay resultados -->
            @if (dulcesFiltrados().length === 0) {
              <div class="text-center py-12">
                <p class="text-6xl mb-4">🔍</p>
                <p class="text-gray-500 text-lg">No se encontraron dulces</p>
                <p class="text-gray-400 text-sm">Intenta con otra búsqueda</p>
              </div>
            }
          </div>

          <!-- Footer - fijo -->
          <div class="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl shrink-0">
            <button
              (click)="cerrar()"
              class="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              (click)="confirmarSeleccion()"
              [disabled]="!dulceSeleccionado()"
              class="px-6 py-2 bg-domus-primary text-white rounded-lg hover:bg-domus-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Seleccionar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
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
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
    .animate-slideUp {
      animation: slideUp 0.3s ease-out;
    }
  `]
})
export class SelectorDulceComponent {
  visible = input(false);
  dulceActual = input<Dulce | null>(null);
  
  // Outputs
  onSeleccionar = output<Dulce>();
  onCerrar = output<void>();

  // Inyecciones
  private tipos_dulces = tipos_de_dulces;
  
  // Estado
  busqueda = signal('');
  dulceSeleccionado = signal<Dulce | null>(null);

  // Efecto para preseleccionar el dulce actual
  constructor() {
    effect(() => {
      if (this.dulceActual()) {
        this.dulceSeleccionado.set(this.dulceActual());
      }
    });
  }

  // Computed
  dulcesFiltrados = computed(() => {
    const busqueda = this.busqueda().toLowerCase().trim();
    if (!busqueda) return this.tipos_dulces;
    return this.tipos_dulces.filter(dulce => 
      dulce.nombre.toLowerCase().includes(busqueda)
    );
  });

  // Métodos
  cerrar() {
    this.onCerrar.emit();
    this.busqueda.set(''); // Limpiar búsqueda al cerrar
  }

  seleccionarDulce(dulce: Dulce) {
    this.dulceSeleccionado.set(dulce);
  }

  confirmarSeleccion() {
    const seleccionado = this.dulceSeleccionado();
    if (seleccionado) {
      this.onSeleccionar.emit(seleccionado);
      this.onCerrar.emit();
      this.busqueda.set(''); // Limpiar búsqueda al confirmar
    }
  }
}