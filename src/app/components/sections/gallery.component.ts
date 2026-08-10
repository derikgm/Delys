import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-gallery',
  standalone: true,
  template: `
    <section class="py-16 bg-domus-light">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-domus-primary mb-12">Galería de Trabajos</h2>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          @for (image of galleryImages(); track image.id) {
            <div class="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 group">
              <img [src]="image.url" 
                   [alt]="image.alt"
                   class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                   loading="lazy">
              @if (image.title) {
                <div class="p-3 bg-white">
                  <p class="text-sm text-domus-primary font-medium">{{ image.title }}</p>
                </div>
              }
            </div>
          }
        </div>

        @if (galleryImages().length === 0) {
          <div class="text-center py-12">
            <p class="text-gray-500 text-lg">Próximamente más imágenes</p>
          </div>
        }
      </div>
    </section>
  `
})
export class GalleryComponent {
  galleryImages = signal([
    { id: 1, url: 'assets/galeria1.jpg', alt: 'Trabajo de limpieza residencial', title: 'Limpieza residencial' },
    { id: 2, url: 'assets/galeria2.jpg', alt: 'Organización de espacios', title: 'Organización' },
    { id: 3, url: 'assets/galeria3.jpg', alt: 'Jardinería profesional', title: 'Jardinería' },
    { id: 4, url: 'assets/galeria4.jpg', alt: 'Limpieza comercial', title: 'Limpieza comercial' },
    { id: 5, url: 'assets/galeria5.jpg', alt: 'Mantenimiento del hogar', title: 'Mantenimiento' },
    { id: 6, url: 'assets/galeria6.jpg', alt: 'Cuidado de personas', title: 'Cuidado de personas' }
  ]);
}