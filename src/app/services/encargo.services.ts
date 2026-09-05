import { computed, Service, signal } from '@angular/core';
import { Dulce, Encargo } from '../interfaces/dulces.interfaces';
import { tipos_de_dulces } from '../common/dulces';

@Service()
export class EncargoServices {


  tipos_de_dulces: Dulce[] = tipos_de_dulces;

  encargos = signal<Encargo []>([]);

  manejar_cambio_de_cantidad(encargo_index: number, nueva_cantidad: number) {
    
    this.encargos.update((encargos) => {
      return encargos.map((encargo, index) => {
        if (index === encargo_index) {
          return {
            ...encargo,
            cantidad: nueva_cantidad
          };
        }
        return encargo;
      });
    });
  }

  // Método para cambiar el dulce seleccionado
  manejar_cambio_de_dulce(encargo_index: number, dulce_id: number) {
    const dulceSeleccionado = this.tipos_de_dulces.find(d => d.id === dulce_id);
    
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
