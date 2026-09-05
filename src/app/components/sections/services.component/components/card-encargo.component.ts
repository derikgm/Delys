// card-encargo.component.ts
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { tipos_de_dulces } from '../../../../common/dulces';
import { Encargo } from '../../../../interfaces/dulces.interfaces';
import { EncargoServices } from '../../../../services/encargo.services';
import { NgIcon } from '@ng-icons/core';
import { matEdit } from '@ng-icons/material-icons/baseline';
import { provideIcons } from '@ng-icons/core';

@Component({
  selector: 'card-encargo-component',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      edit: matEdit,
    })
  ],
  template: `
    <div class="flex flex-col overflow-hidden mt-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <!-- Imagen previa - Click para cambiar -->
      <div 
        (click)="abrirSelectorConEvento($event)"
        class="w-full bg-gray-100 flex items-center justify-center 
        border-2 rounded-t-xl border-gray-200 aspect-square relative group cursor-pointer
        hover:border-domus-primary transition-colors duration-300 overflow-hidden"
      >
        @if (encargo().dulce.imagen) {
          <img 
            [src]="encargo().dulce.imagen" 
            [alt]="encargo().dulce.nombre"
            class="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-300">
        } @else {
          <p class="text-gray-400 text-sm select-none aspect-square 
          items-center flex">🍬</p>
        }
        
        <!-- Overlay de cambio -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          flex items-center justify-center">
          <div class="bg-white/90 rounded-full p-3 shadow-lg">
            <ng-icon name="edit" class="text-2xl text-domus-primary" />
          </div>
        </div>
        
        <!-- Nombre del dulce en la imagen -->
        <div class="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white 
          text-xs py-1 px-2 rounded-md text-center truncate">
          {{ encargo().dulce.nombre }}
        </div>
      </div>

      <!-- Formulario del encargo -->
      <div class="flex flex-col p-4 bg-white">
        <!-- Cantidad -->
        <div class="flex items-center justify-between mb-3">
          <label class="font-medium text-gray-700 select-none">Cantidad</label>
          <div class="flex items-center gap-2">
            <button
              (click)="disminuirCantidad()"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center 
              font-bold text-gray-600 transition-colors cursor-pointer select-none"
            >
              −
            </button>
            <input
              #cantidad_input
              type="number" 
              min="1" 
              [value]="encargo().cantidad"
              class="w-16 text-center border-2 border-gray-200 rounded-lg py-1 outline-none 
              focus:border-domus-primary transition-colors"
              (input)="encargo_services.manejar_cambio_de_cantidad(index(), +$event.target.value)"
            >
            <button
              (click)="aumentarCantidad()"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center 
              font-bold text-gray-600 transition-colors cursor-pointer select-none"
            >
              +
            </button>
          </div>
        </div>

        <!-- Precio -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Precio unitario:</span>
            <span class="font-semibold text-domus-primary">{{ encargo().dulce.precio }} CUP</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Total:</span>
            <span class="font-bold text-domus-primary text-lg">
              {{ encargo().dulce.precio * encargo().cantidad }} CUP
            </span>
          </div>
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
  
  // Output para abrir el selector
  abrirSelector = output<void>();

  disminuirCantidad() {
    const cantidad = this.encargo().cantidad;
    if (cantidad > 1) {
      this.encargo_services.manejar_cambio_de_cantidad(this.index(), cantidad - 1);
    }
  }

  aumentarCantidad() {
    const cantidad = this.encargo().cantidad;
    this.encargo_services.manejar_cambio_de_cantidad(this.index(), cantidad + 1);
  }

  abrirSelectorConEvento(event: Event) {
    event.stopPropagation(); // Evita que se propague
    this.abrirSelector.emit();
  }
}