import { Component, computed, OnInit, signal } from '@angular/core';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { matAdd } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-services',
  standalone: true,
  providers: [
    provideIcons({
      agregar: matAdd,
    })
  ],
  template: `
    <section class="py-16 bg-domus-light">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-domus-primary mb-12">
          Encarge su dulce
        </h2>

        <!-- Seccion de dulces a encargar: -->
        <div class="w-full">
          <!-- Grid de dulces -->
          <div class="w-full text-xl">
            @for (encargo of encargos(); track $index) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                <!-- Formulario del encargo - Ocupa exactamente la mitad -->
                <div class="p-2 space-y-4 bg-white border-2 rounded border-gray-500">
                  <div class="flex w-full justify-between items-center">
                    <p class="font-medium select-none">Dulce</p>
                    <select 
                      [value]="encargo.dulce.nombre"
                      (change)="manejar_cambio_de_dulce($index, $event)"
                      class="rounded px-2 py-1 w-1/2 outline outline-2">
                      @for (dulce of tipos_de_dulces; track $index) {
                        <option [value]="dulce.nombre">{{dulce.nombre}}</option>
                      }
                    </select>
                  </div>

                  <!-- Cantidad -->
                  <div class="flex w-full justify-between items-center">
                    <p class="font-medium select-none">Cantidad</p>
                    <input 
                      type="number" 
                      min="1" 
                      [value]="encargo.cantidad"
                      class="outline outline-2 rounded w-1/2 text-center px-2 py-1"
                      (input)="manejar_cambio_de_cantidad($index, $event.target)">
                  </div>
                </div>

                <!-- Imagen previa - Ocupa exactamente la otra mitad -->
                <div class="w-full bg-gray-100 flex items-center justify-center 
                min-h-[150px] md:min-h-0 border-2 rounded border-gray-500">
                  @if (encargo.dulce.imagen) {
                    <img 
                      [src]="encargo.dulce.imagen" 
                      [alt]="encargo.dulce.nombre"
                      class="w-full h-full object-cover">
                  } @else {
                    <p class="text-gray-400 text-sm select-none">Vista previa</p>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Botón agregar -->
          <div class="w-full flex justify-between my-4 items-center 
          cursor-pointer agregar-padre transition-colors">
            <div class="w-full flex justify-center items-center">
              <div class="flex justify-center items-center border-2 rounded">
                <ng-icon class="text-4xl border-r-2" name="agregar" />
                <span class="text-2xl px-2 select-none">Agregar otro dulce</span>
              </div>
            </div>

            <div class="flex w-full justify-center space-x-2 text-2xl">
              <p>Precio Estimado:</p>
              <p>{{precio()}} CUP</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <style>
      .agregar-padre:hover {
        @reference "tailwindcss";
        div {
          @apply border-green-700;
          div{
            ng-icon {
              @apply text-green-700;
            }

            span{
              @apply text-green-700;
            }
          }
        }
      }
    </style>
  `,
  imports: [NgIcon]
})
export class ServicesComponent implements OnInit{

  precio = computed<number>(() => {
    let precio = 0;
    this.encargos().forEach((e) => {precio += (e.dulce.precio * e.cantidad)})
    return precio;
  })

  tipos_de_dulces: Dulce[] = [];

  encargos = signal<Encargo []>([]);
  encargos_no_signal: Encargo [] = []

  ngOnInit(): void {
    this.tipos_de_dulces.push({
      precio: 2000,
      nombre: 'Cake Comun'
    })

    this.encargos.set([{
      dulce: this.tipos_de_dulces[0],
      cantidad: 1
    }])
  }
// Método para cambiar el dulce seleccionado
manejar_cambio_de_dulce(encargo_index: number, event: Event) {
  const select = event.target as HTMLSelectElement;
  const nombreDulce = select.value;
  const dulceSeleccionado = this.tipos_de_dulces.find(d => d.nombre === nombreDulce);
  
  if (dulceSeleccionado) {
    this.encargos.update((encargos) => {
      return encargos.map((encargo, index) => {
        if (index === encargo_index) {
          return {
            ...encargo,
            dulce: dulceSeleccionado
          };
        }
        return encargo;
      });
    });
  }
}

  // Método para agregar un nuevo encargo
  agregar_encargo() {
    this.encargos.update((encargos) => {
      return [
        ...encargos,
        {
          dulce: this.tipos_de_dulces[0], // Por defecto el primer dulce
          cantidad: 1
        }
      ];
    });
  }

  // También actualiza el método de cantidad para usar el valor actual
  manejar_cambio_de_cantidad(encargo_index: number, input: HTMLInputElement) {
    const nuevaCantidad = parseInt(input.value) || 1;
    
    this.encargos.update((encargos) => {
      return encargos.map((encargo, index) => {
        if (index === encargo_index) {
          return {
            ...encargo,
            cantidad: nuevaCantidad
          };
        }
        return encargo;
      });
    });
  }
}

export interface Dulce {
  precio: number,
  nombre: string,
  rebaja?: number,
  imagen?: string,
}

export interface Encargo {
  dulce: Dulce,
  cantidad: number,
}