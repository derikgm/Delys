import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-domus-primary mb-12">Nosotros</h2>

        <!-- Historia -->
        <div class="mb-16">
          <h3 class="text-2xl font-semibold text-domus-secondary mb-4 flex items-center gap-2">
            <i class="fas fa-history text-domus-accent"></i> Nuestra Historia
          </h3>
          <p class="text-gray-700 leading-relaxed">
            DOMUS nació en 2020 con la visión de transformar la manera en que las personas cuidan sus espacios. 
            Comenzamos como un pequeño equipo de limpieza y hoy somos una empresa integral de servicios para el hogar y la oficina.
          </p>
        </div>

        <!-- Grid Misión, Visión, Valores -->
        <div class="grid md:grid-cols-3 gap-8">
          @for (item of aboutItems; track item.title) {
            <div class="bg-domus-light p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
              <div class="text-4xl text-domus-accent mb-4">
                <i [class]="item.icon"></i>
              </div>
              <h3 class="text-xl font-semibold text-domus-primary mb-2">{{ item.title }}</h3>
              <p class="text-gray-700">{{ item.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class AboutComponent {
  aboutItems = [
    {
      title: 'Misión',
      icon: 'fas fa-bullseye',
      description: 'Ofrecer servicios de calidad que mejoren la calidad de vida de nuestros clientes.'
    },
    {
      title: 'Visión',
      icon: 'fas fa-eye',
      description: 'Ser la empresa líder en servicios integrales para el hogar en toda Latinoamérica.'
    },
    {
      title: 'Valores',
      icon: 'fas fa-handshake',
      description: 'Confianza, calidad, innovación, compromiso y calidez humana.'
    }
  ];
}