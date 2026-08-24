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
          <div class="w-full text-xl grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2
          gap-4 sm:grid-cols-2">
            @for (encargo of encargos(); track $index) {
              <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4 
              overflow-hidden mt-6"> -->

              <div class="flex flex-col
              overflow-hidden mt-6">
              
              <!-- Imagen previa -->
              <div class="w-full bg-gray-100 flex items-center justify-center 
                border-2 rounded-t border-gray-500 aspect-square">
                @if (encargo.dulce.imagen) {
                  <img 
                    [src]="encargo.dulce.imagen" 
                    [alt]="encargo.dulce.nombre"
                    class="w-full h-full object-cover aspect-square">
                } @else {
                  <p class="text-gray-400 text-sm select-none aspect-square 
                  items-center flex">Vista previa</p>
                }
              </div>

                <!-- Formulario del encargo - Ocupa exactamente la mitad -->
                <div class="flex flex-col p-2 bg-white h-full border-b-2
                  border-l-2 border-r-2 rounded-b border-gray-500 justify-around space-y-4">
                  <!-- nombre -->
                  <div class="flex w-full justify-between items-center">
                    <p class="font-medium select-none">Dulce</p>
                    <select 
                      [value]="encargo.dulce.nombre"
                      (change)="manejar_cambio_de_dulce($index, $event)"
                      class="rounded px-2 py-1 w-1/2 outline-2">
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
                      class="outline-2 rounded w-1/2 text-center px-2 py-1"
                      (input)="manejar_cambio_de_cantidad($index, $event.target)">
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Botón agregar -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 
          justify-between my-4 items-center transition-colors"
          (click)="agregar_encargo()">
            <div class="w-full flex justify-center items-center agregar-padre cursor-pointer">
              <div class="flex justify-center items-center border-2 rounded">
                <ng-icon class="text-4xl border-r-2" name="agregar" />
                <span class="text-2xl px-2 select-none">Agregar otro dulce</span>
              </div>
            </div>

            <div class="flex w-full justify-center space-x-2 text-2xl select-none">
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

          ng-icon {
            @apply text-green-700;
          }
          span{
            @apply text-green-700;
          }
        }
      }
    </style>
  `,
  imports: [NgIcon]
})
export class ServicesComponent implements OnInit {

  precio = computed<number>(() => {
    let precio = 0;
    this.encargos().forEach((e) => {precio += (e.dulce.precio * e.cantidad)})
    return precio;
  })

  tipos_de_dulces: Dulce[] = [];

  encargos = signal<Encargo []>([]);
  encargos_no_signal: Encargo [] = []

  ngOnInit(): void {
    this.tipos_de_dulces.push(...tipos_de_dulces);

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
          cantidad: 1,
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

//Tipos de dulces:
let tipos_de_dulces: Dulce[] = [
  {
    precio: 4500,
    nombre: 'Chocoflan con merenge'
  },
  {
    precio: 2000,
    nombre: 'Flan mediano (15 cm)'
  },
  {
    precio: 3000,
    nombre: 'Flan Grande (18 cm)'
  },
]