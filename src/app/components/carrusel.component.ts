import { ChangeDetectionStrategy, Component, signal, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { getImageUrl } from '../common/dulces';

@Component({
  selector: 'carrusel-component',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
      <!-- Contenedor del carrusel -->
      <div class="relative h-[400px] md:h-[500px] bg-gray-900">
        <!-- Imágenes -->
        @for (image of images(); track image.id; let i = $index) {
          <div 
            class="absolute inset-0 transition-opacity duration-700 ease-in-out"
            [ngClass]="{
              'opacity-100 z-10': currentIndex() === i,
              'opacity-0 z-0': currentIndex() !== i
            }"
          >
            <img 
              [src]="image.url" 
              [alt]="image.alt"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        }
        
        <!-- Overlay inferior con indicadores -->
        <div class="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div class="flex justify-center gap-2 mb-2">
            @for (image of images(); track image.id; let i = $index) {
              <button
                class="w-3 h-3 rounded-full transition-all duration-300"
                [ngClass]="{
                  'bg-white scale-110': currentIndex() === i,
                  'bg-white/50 hover:bg-white/70': currentIndex() !== i
                }"
                (click)="goTo(i)"
                [attr.aria-label]="'Ir a imagen ' + (i + 1)"
              ></button>
            }
          </div>
        </div>
      </div>

      <!-- Botones de navegación -->
      @if (images().length > 1) {
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm hover:scale-110"
          (click)="previous()"
          aria-label="Imagen anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm hover:scale-110"
          (click)="next()"
          aria-label="Siguiente imagen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      }

      <!-- Contador de imágenes -->
      <div class="absolute top-4 right-4 z-20 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
        {{ currentIndex() + 1 }} / {{ images().length }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarruselComponent {
  // Signal para el índice actual
  currentIndex = signal(0);
  
  // Signal para las imágenes
  images = signal<Array<{ id: number; url: string; alt: string }>>([
    { id: 1, url: getImageUrl('cake (1).jpg'), alt: 'Pastel 1' },
    { id: 2, url: getImageUrl('cake (2).jpg'), alt: 'Pastel 2' },
    { id: 3, url: getImageUrl('cake (3).jpg'), alt: 'Pastel 3' },
    { id: 4, url: getImageUrl('cake (4).jpg'), alt: 'Pastel 4' },
    { id: 5, url: getImageUrl('cake (5).jpg'), alt: 'Pastel 5' }
  ]);

  // Intervalo para auto-play (opcional)
  private autoPlayInterval?: ReturnType<typeof setInterval>;

  constructor() {
    this.startAutoPlay();
  }

  // Método para ir a la siguiente imagen
  next(): void {
    this.currentIndex.update(current => 
      current === this.images().length - 1 ? 0 : current + 1
    );
    this.resetAutoPlay();
  }

  // Método para ir a la imagen anterior
  previous(): void {
    this.currentIndex.update(current => 
      current === 0 ? this.images().length - 1 : current - 1
    );
    this.resetAutoPlay();
  }

  // Método para ir a una imagen específica
  goTo(index: number): void {
    this.currentIndex.set(index);
    this.resetAutoPlay();
  }

  // Iniciar auto-play (cambia cada 5 segundos)
  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 4000);
  }

  // Reiniciar el auto-play cuando el usuario interactúa
  private resetAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.startAutoPlay();
    }
  }

  // Limpiar el intervalo cuando el componente se destruye
  @HostListener('document:visibilitychange')
  handleVisibilityChange(): void {
    if (document.hidden) {
      // Pausar cuando la pestaña no está visible
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
      }
    } else {
      // Reanudar cuando la pestaña vuelve a ser visible
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}