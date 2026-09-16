import { Component, inject, signal } from '@angular/core';
import { EncargoServices } from '../../services/encargo.services';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { matWhatsappOutline } from '@ng-icons/material-icons/outline';
import { contacto_link, numero_contacto } from '../../../data/contacto';

@Component({
  selector: 'productos-component',
  templateUrl: 'productos.component.html',
  imports: [NgIcon],
  providers: [
    provideIcons({
      whatsap: matWhatsappOutline
    })
  ]
})
export class ProductosComponent {
  encargo_services = inject(EncargoServices)

  ofertas = this.encargo_services.tipos_de_dulces;

  mostrar_todos = signal(false);
  
  whatsappLink = contacto_link;

  constructor () {

  }

}
