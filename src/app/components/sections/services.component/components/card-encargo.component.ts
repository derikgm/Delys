import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { tipos_de_dulces } from '../../../../common/dulces';
import { Encargo } from '../../../../interfaces/dulces.interfaces';
import { EncargoServices } from '../../../../services/encargo.services';


@Component({
  selector: 'card-encargo-component',
  imports: [],
  template: `
                  <div class="flex flex-col
              overflow-hidden mt-6">
              
              <!-- Imagen previa -->
              <div class="w-full bg-gray-100 flex items-center justify-center 
                border-2 rounded-t border-gray-500 aspect-square">
                @if (encargo().dulce.imagen) {
                  <img 
                    [src]="encargo().dulce.imagen" 
                    [alt]="encargo().dulce.nombre"
                    class="w-full h-full object-cover aspect-square">
                } @else {
                  <p class="text-gray-400 text-sm select-none aspect-square 
                  items-center flex">Vista previa</p>
                }
              </div>

                <!-- Formulario del encargo() - Ocupa exactamente la mitad -->
                <div class="flex flex-col p-2 bg-white h-full border-b-2
                  border-l-2 border-r-2 rounded-b border-gray-500 justify-around space-y-4">
                  <!-- nombre -->
                  <div class="flex w-full justify-between items-center">
                    <p class="font-medium select-none">Dulce</p>
                    <select 
                      [value]="encargo().dulce.nombre"
                      (change)="encargo_services.manejar_cambio_de_dulce(index(), $event)"
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
                      #cantidad_input
                      type="number" 
                      min="1" 
                      [value]="encargo().cantidad"
                      class="outline-2 rounded w-1/2 text-center px-2 py-1"
                      (input)="encargo_services.manejar_cambio_de_cantidad(index(), $event.target)">
                  </div>

                  <!-- Precio por unidad -->
                  <div class="flex w-full justify-between items-center">
                    <p class="font-medium select-none">
                      {{encargo().dulce.precio}} CUP / U
                    </p>

                    <p class="font-medium select-none">
                      {{encargo().dulce.precio * +cantidad_input.value}} CUP / C
                    </p>
                  </div>
                </div>
              </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class EncargoComponent {
  index = input.required<number>();
  encargo = input.required<Encargo>();
  tipos_de_dulces = tipos_de_dulces;

  encargo_services = inject(EncargoServices);

}
