import { Component } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-delys-primary mb-12">Radicamos en</h2>

        <!-- TODO: agregar imagen o mapa del lugar donde se encuentra Delys. -->
      </div>
    </section>
  `,
})
export class NosotrosComponent {}
