import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-domus-primary text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <!-- Logo -->
          <div class="flex items-center gap-2 text-2xl font-bold">
            <i class="fas fa-home"></i>
            <span>Delys</span>
          </div>

          <!-- Redes Sociales -->
          <div class="flex gap-6 text-2xl">
            @for (social of socialLinks; track social.name) {
              <a [href]="social.url" 
                 target="_blank" 
                 class="hover:text-domus-accent transition-colors"
                 [attr.aria-label]="social.name">
                <i [class]="social.icon"></i>
              </a>
            }
          </div>

          <!-- Derechos -->
          <p class="text-sm text-gray-300">
            © {{ currentYear }} DOMUS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook', url: '#' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: '#' },
    { name: 'YouTube', icon: 'fab fa-youtube', url: '#' },
    { name: 'TikTok', icon: 'fab fa-tiktok', url: '#' }
  ];
}