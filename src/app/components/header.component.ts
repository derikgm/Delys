import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Logo -->
        <a href="#inicio" class="flex items-center gap-2 text-2xl font-bold text-domus-primary">
          <i class="fas fa-home"></i>
          <span>DELYS</span>
        </a>

        <!-- Menú Desktop -->
        <ul class="hidden md:flex gap-6 text-domus-primary font-medium">
          @for (item of menuItems; track item.id) {
            <li class="rounded hover:bg-gray-200 px-2 py-2">
              <a [href]="'#' + item.id" 
                 (click)="scrollTo(item.id)"
                 class="hover:text-domus-accent transition-colors">
                {{ item.label }}
              </a>
            </li>
          }
        </ul>

        <!-- Botón Hamburguesa Mobile -->
        <button (click)="toggleMenu()" class="md:hidden text-2xl text-domus-primary">
          <i [class]="menuOpen() ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>
      </nav>

      <!-- Menú Mobile -->
      @if (menuOpen()) {
        <div class="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <ul class="flex flex-col p-4 gap-3 text-domus-primary font-medium">
            @for (item of menuItems; track item.id) {
              <li>
                <a [href]="'#' + item.id" 
                   (click)="scrollTo(item.id); closeMenu()"
                   class="block hover:text-domus-accent transition-colors">
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>
        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  menuOpen = signal(false);
  
  menuItems = [
    { id: 'productos', label: 'Productos' },
    { id: 'encargo', label: 'Encarge su dulce' },
    { id: 'radicamos', label: 'Lugar' },
    { id: 'contacto', label: 'contacto' },
  ];

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}