import { computed, Service, signal } from '@angular/core';
import { Dulce, Encargo } from '../interfaces/dulces.interfaces';
import { tipos_de_dulces } from '../common/dulces';

@Service()
export class EncargoServices {


  tipos_de_dulces: Dulce[] = tipos_de_dulces;

  encargos = signal<Encargo []>([]);

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
}
