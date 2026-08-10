import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matWhatsappOutline, matMailOutline, matMapOutline, matPhoneOutline} from "@ng-icons/material-icons/outline"

@Component({
  selector: 'app-contact',
  standalone: true,
  imports:[NgIcon],
  providers:[
    provideIcons({
      whatsap: matWhatsappOutline,
      mail: matMailOutline,
      map: matMapOutline,
      phone: matPhoneOutline,
    })
  ],

  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-domus-primary mb-12">Contacto</h2>

        <div class="grid md:grid-cols-2 gap-12">
          <!-- Información de contacto -->
          <div class="space-y-6">
            @for (contact of contactInfo(); track contact.label) {
              <div class="flex items-center gap-4 group">
                <div [class]="contact.bgColor + ' p-3 rounded-full text-white text-xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform'">
                <ng-icon [name]="contact.icon" class="text-3xl"/>
              </div>
                <div>
                  <p class="font-semibold text-domus-primary">{{ contact.label }}</p>
                  <a [href]="contact.href" 
                     [target]="contact.target || '_self'"
                     class="text-domus-secondary hover:text-domus-accent transition-colors">
                    {{ contact.value }}
                  </a>
                </div>
              </div>
            }
          </div>

          <!-- Formulario -->
          <div class="bg-domus-light p-6 rounded-lg shadow-md">
            <h3 class="text-2xl font-bold text-domus-primary mb-4">Envíanos un mensaje</h3>
            <form action="mailto:info@domus.mx" 
                  method="post" 
                  enctype="text/plain" 
                  class="space-y-4">
              <div>
                <label for="nombre" class="block text-domus-primary font-medium mb-1">Nombre</label>
                <input type="text" 
                       id="nombre" 
                       name="nombre" 
                       required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-domus-accent focus:outline-none">
              </div>
              <div>
                <label for="correo" class="block text-domus-primary font-medium mb-1">Correo</label>
                <input type="email" 
                       id="correo" 
                       name="correo" 
                       required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-domus-accent focus:outline-none">
              </div>
              <div>
                <label for="mensaje" class="block text-domus-primary font-medium mb-1">Mensaje</label>
                <textarea id="mensaje" 
                          name="mensaje" 
                          rows="4" 
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-domus-accent focus:outline-none"></textarea>
              </div>
              <button type="submit"
                      class="w-full bg-domus-accent hover:bg-yellow-500 text-domus-primary font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                <i class="fas fa-paper-plane"></i> Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  contactInfo = signal([
    {
      icon: 'phone',
      label: 'Teléfono',
      value: '+52 123 456 7890',
      href: 'tel:+521234567890',
      bgColor: 'bg-black'
    },
    {
      icon: 'whatsap',
      label: 'WhatsApp',
      value: '+52 123 456 7890',
      href: 'https://wa.me/5211234567890',
      target: '_blank',
      bgColor: 'bg-green-500'
    },
    {
      icon: 'mail',
      label: 'Correo',
      value: 'info@domus.mx',
      href: 'mailto:info@domus.mx',
      bgColor: 'bg-blue-500'
    },
    {
      icon: 'map',
      label: 'Dirección',
      value: 'SS, Av. 26 de julio, 568-C',
      href: '#',
      bgColor: 'bg-red-500'
    }
  ]);
}