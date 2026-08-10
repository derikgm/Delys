import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  template: `
    <section class="py-16 bg-domus-light">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-domus-primary mb-12">Nuestros Servicios</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (service of services; track service.name) {
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div class="text-4xl text-domus-accent mb-4">
                <i [class]="service.icon"></i>
              </div>
              <h3 class="text-xl font-semibold text-domus-primary mb-2">{{ service.name }}</h3>
              <p class="text-gray-600 text-sm">{{ service.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent {
  services = [
    { name: 'Limpieza Residencial', description: 'Limpieza profunda y mantenimiento de tu hogar.', icon: 'fas fa-broom' },
    { name: 'Limpieza Comercial', description: 'Servicios profesionales para oficinas y locales.', icon: 'fas fa-building' },
    { name: 'Organización de Espacios', description: 'Orden y funcionalidad en cada rincón.', icon: 'fas fa-archive' },
    { name: 'Lavandería', description: 'Cuidado profesional de tu ropa y textiles.', icon: 'fas fa-tshirt' },
    { name: 'Jardinería', description: 'Mantenimiento y diseño de áreas verdes.', icon: 'fas fa-leaf' },
    { name: 'Cuidado de Personas', description: 'Asistencia y compañía para adultos mayores.', icon: 'fas fa-heart' },
    { name: 'Mantenimiento Básico', description: 'Reparaciones y mejoras en tu hogar.', icon: 'fas fa-tools' }
  ];
}