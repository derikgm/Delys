import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-pagina',
  standalone: true,
  template: `
    <footer class="bg-delys-primary text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2 text-2xl font-bold">
            <span>Delys</span>
          </div>

          <p class="text-sm text-gray-300">
            © {{ anioActual }} DELYS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class PiePaginaComponent {
  readonly anioActual = new Date().getFullYear();
}
