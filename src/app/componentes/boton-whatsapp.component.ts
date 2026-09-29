import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matWhatsappOutline } from '@ng-icons/material-icons/outline';
import { contactoLink } from '../datos/contacto';

@Component({
  selector: 'app-boton-whatsapp',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      whatsapp: matWhatsappOutline,
    }),
  ],
  template: `
    <a
      [href]="contactoLink"
      target="_blank"
      rel="noopener"
      aria-label="Escribir por WhatsApp"
      class="whatsapp-button fixed bottom-6 right-6 bg-green-500 text-white w-13 h-13
             rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-50
             items-center inline-flex justify-center"
    >
      <ng-icon name="whatsapp" class="text-4xl" />
    </a>
  `,
})
export class BotonWhatsappComponent {
  readonly contactoLink = contactoLink;
}
