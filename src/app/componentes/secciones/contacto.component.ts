import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matMailOutline,
  matPhoneOutline,
  matWhatsappOutline,
} from '@ng-icons/material-icons/outline';
import {
  contactoLink,
  correoContacto,
  correoLink,
  telefonoLink,
  telefonoVisible,
} from '../../datos/contacto';

interface DatoContacto {
  icono: string;
  etiqueta: string;
  valor: string;
  enlace: string;
  destino: string;
  color: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      whatsapp: matWhatsappOutline,
      correo: matMailOutline,
      telefono: matPhoneOutline,
    }),
  ],
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-delys-primary mb-12">Contacto</h2>

        <div class="grid md:grid-cols-2 gap-12">
          <div class="space-y-6">
            @for (dato of datosContacto; track dato.etiqueta) {
              <div class="flex items-center gap-4 group">
                <div
                  [class]="
                    dato.color +
                    ' p-3 rounded-full text-white text-xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform'
                  "
                >
                  <ng-icon [name]="dato.icono" class="text-3xl" />
                </div>
                <div>
                  <p class="font-semibold text-delys-primary">{{ dato.etiqueta }}</p>
                  <a
                    [href]="dato.enlace"
                    [target]="dato.destino"
                    rel="noopener"
                    class="text-delys-secondary hover:text-delys-accent transition-colors"
                  >
                    {{ dato.valor }}
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactoComponent {
  // La dirección se muestra cuando se defina el lugar donde radica Delys.
  readonly datosContacto: DatoContacto[] = [
    {
      icono: 'telefono',
      etiqueta: 'Teléfono',
      valor: telefonoVisible,
      enlace: telefonoLink,
      destino: '_self',
      color: 'bg-black',
    },
    {
      icono: 'whatsapp',
      etiqueta: 'WhatsApp',
      valor: telefonoVisible,
      enlace: contactoLink,
      destino: '_blank',
      color: 'bg-green-500',
    },
    {
      icono: 'correo',
      etiqueta: 'Correo',
      valor: correoContacto,
      enlace: correoLink,
      destino: '_self',
      color: 'bg-blue-500',
    },
  ];
}
