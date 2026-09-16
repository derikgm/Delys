import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {matWhatsappOutline} from "@ng-icons/material-icons/outline"
import { contacto_link } from '../../data/contacto';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports:[NgIcon],
  providers:[
    provideIcons({
      whatsap: matWhatsappOutline
    })
  ],
  template: `
    <a [href]="whatsappLink" 
       target="_blank"
       class="whatsapp-button fixed bottom-6 right-6 bg-green-500 text-white w-13 h-13 
       rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-50
       items-center inline-flex justify-center">
        <ng-icon name="whatsap" class="text-4xl"/>
    </a>
  `
})
export class WhatsAppButtonComponent {
  whatsappLink = contacto_link;
}