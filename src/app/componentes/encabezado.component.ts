import { Component, signal } from '@angular/core';

interface EnlaceMenu {
  id: string;
  etiqueta: string;
}

@Component({
  selector: 'app-encabezado',
  standalone: true,
  template: `
    <header class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#inicio" class="flex items-center gap-2 text-2xl font-bold text-delys-primary">
          <span>DELYS</span>
        </a>

        <!-- Menú de escritorio -->
        <ul class="hidden md:flex gap-6 text-delys-primary font-medium">
          @for (enlace of enlacesMenu; track enlace.id) {
            <li class="rounded hover:bg-gray-200 px-2 py-2">
              <a
                [href]="'#' + enlace.id"
                (click)="desplazarA(enlace.id)"
                class="hover:text-delys-accent transition-colors"
              >
                {{ enlace.etiqueta }}
              </a>
            </li>
          }
        </ul>

        <!-- Botón hamburguesa (móvil) -->
        <button
          type="button"
          (click)="alternarMenu()"
          class="md:hidden text-2xl text-delys-primary"
          aria-label="Abrir menú de navegación"
          [attr.aria-expanded]="menuAbierto()"
        >
          <span aria-hidden="true">{{ menuAbierto() ? '✕' : '☰' }}</span>
        </button>
      </nav>

      <!-- Menú móvil -->
      @if (menuAbierto()) {
        <div class="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <ul class="flex flex-col p-4 gap-3 text-delys-primary font-medium">
            @for (enlace of enlacesMenu; track enlace.id) {
              <li>
                <a
                  [href]="'#' + enlace.id"
                  (click)="desplazarA(enlace.id); cerrarMenu()"
                  class="block hover:text-delys-accent transition-colors"
                >
                  {{ enlace.etiqueta }}
                </a>
              </li>
            }
          </ul>
        </div>
      }
    </header>
  `,
})
export class EncabezadoComponent {
  readonly menuAbierto = signal(false);

  readonly enlacesMenu: EnlaceMenu[] = [
    { id: 'productos', etiqueta: 'Productos' },
    { id: 'encargo', etiqueta: 'Encargue su dulce' },
    { id: 'radicamos', etiqueta: 'Lugar' },
    { id: 'contacto', etiqueta: 'Contacto' },
  ];

  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  desplazarA(idSeccion: string): void {
    document.getElementById(idSeccion)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
