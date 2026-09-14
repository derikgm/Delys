import {  inject, Injectable, signal } from '@angular/core';
import { Dulce, Encargo } from '../interfaces/dulces.interfaces';
import { getImageUrl, is_in_dev_mode, } from '../common/dulces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' 
})
export class EncargoServices {
  API_URL = is_in_dev_mode()
  ?  `http://localhost:3000/delys`
  :  `https://multiserver-familiar.onrender.com/delys`

  cargando_dulces = signal(true);
  tipos_de_dulces = signal<Dulce[]>([]);

  encargos = signal<Encargo[]>([]);

  http = inject(HttpClient)

  async init() {
    try {
        this.http.get<{dulces: Dulce[]}>(`${this.API_URL}/dulces`).subscribe({
          next: (data) => {
            const dulces = data.dulces.map((d) => {
              d.imagen = getImageUrl(d.nombre);
              return d;
            })

            this.tipos_de_dulces.set(dulces)
            this.cargando_dulces.set(false);
          }
        })
      } catch (error) {
        console.error('Error al cargar los dulces:', error);
      }
    }

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
    const dulceSeleccionado = this.tipos_de_dulces().find(d => d.id === dulce_id);

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
