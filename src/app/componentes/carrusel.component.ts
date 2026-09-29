import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { obtenerUrlImagen } from '../comunes/imagenes';

interface ImagenCarrusel {
  id: number;
  url: string;
  alt: string;
}

/** Milisegundos entre cambio automático de imagen. */
const INTERVALO_REPRODUCCION = 4000;

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
      <div class="relative h-100 md:h-125 bg-gray-900">
        @for (imagen of imagenes(); track imagen.id; let indice = $index) {
          <div
            class="absolute inset-0 transition-opacity duration-700 ease-in-out"
            [ngClass]="{
              'opacity-100 z-10': indiceActual() === indice,
              'opacity-0 z-0': indiceActual() !== indice,
            }"
          >
            <img
              [src]="imagen.url"
              [alt]="imagen.alt"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        }

        <div
          class="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/60 to-transparent p-4"
        >
          <div class="flex justify-center gap-2 mb-2">
            @for (imagen of imagenes(); track imagen.id; let indice = $index) {
              <button
                type="button"
                class="w-3 h-3 rounded-full transition-all duration-300"
                [ngClass]="{
                  'bg-white scale-110': indiceActual() === indice,
                  'bg-white/50 hover:bg-white/70': indiceActual() !== indice,
                }"
                (click)="irA(indice)"
                [attr.aria-label]="'Ir a la imagen ' + (indice + 1)"
              ></button>
            }
          </div>
        </div>
      </div>

      @if (imagenes().length > 1) {
        <button
          type="button"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm hover:scale-110"
          (click)="anterior()"
          aria-label="Imagen anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm hover:scale-110"
          (click)="siguiente()"
          aria-label="Imagen siguiente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      }

      <div
        class="absolute top-4 right-4 z-20 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm"
      >
        {{ indiceActual() + 1 }} / {{ imagenes().length }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarruselComponent implements OnDestroy {
  readonly indiceActual = signal(0);

  readonly imagenes = signal<ImagenCarrusel[]>([
    { id: 1, url: obtenerUrlImagen('cake (1)'), alt: 'Pastel 1' },
    { id: 2, url: obtenerUrlImagen('cake (2)'), alt: 'Pastel 2' },
    { id: 3, url: obtenerUrlImagen('cake (3)'), alt: 'Pastel 3' },
    { id: 4, url: obtenerUrlImagen('cake (4)'), alt: 'Pastel 4' },
    { id: 5, url: obtenerUrlImagen('cake (5)'), alt: 'Pastel 5' },
  ]);

  private intervalo?: ReturnType<typeof setInterval>;

  constructor() {
    this.iniciarReproduccionAutomatica();
    document.addEventListener('visibilitychange', this.alCambiarVisibilidad);
  }

  siguiente(): void {
    this.indiceActual.update((indice) => (indice === this.imagenes().length - 1 ? 0 : indice + 1));
    this.reiniciarReproduccionAutomatica();
  }

  anterior(): void {
    this.indiceActual.update((indice) => (indice === 0 ? this.imagenes().length - 1 : indice - 1));
    this.reiniciarReproduccionAutomatica();
  }

  irA(indice: number): void {
    this.indiceActual.set(indice);
    this.reiniciarReproduccionAutomatica();
  }

  ngOnDestroy(): void {
    this.detenerReproduccionAutomatica();
    document.removeEventListener('visibilitychange', this.alCambiarVisibilidad);
  }

  private readonly alCambiarVisibilidad = (): void => {
    if (document.hidden) {
      this.detenerReproduccionAutomatica();
    } else {
      this.iniciarReproduccionAutomatica();
    }
  };

  private iniciarReproduccionAutomatica(): void {
    this.intervalo = setInterval(() => this.siguiente(), INTERVALO_REPRODUCCION);
  }

  private reiniciarReproduccionAutomatica(): void {
    this.detenerReproduccionAutomatica();
    this.iniciarReproduccionAutomatica();
  }

  private detenerReproduccionAutomatica(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = undefined;
    }
  }
}
