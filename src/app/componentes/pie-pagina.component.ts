import { Component } from '@angular/core';

interface RedSocial {
  nombre: string;
  icono: string;
  url: string;
}

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

          <div class="flex gap-6 text-2xl">
            @for (red of redesSociales; track red.nombre) {
              <a
                [href]="red.url"
                target="_blank"
                rel="noopener"
                class="hover:text-delys-accent transition-colors"
                [attr.aria-label]="red.nombre"
              >
                <span [class]="red.icono" aria-hidden="true"></span>
              </a>
            }
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

  readonly redesSociales: RedSocial[] = [
    { nombre: 'Facebook', icono: 'fab fa-facebook', url: '#' },
    { nombre: 'Instagram', icono: 'fab fa-instagram', url: '#' },
    { nombre: 'YouTube', icono: 'fab fa-youtube', url: '#' },
    { nombre: 'TikTok', icono: 'fab fa-tiktok', url: '#' },
  ];
}
