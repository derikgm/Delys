import { Component, inject } from '@angular/core';
import { ContactComponent } from '../sections/contact.component';
import { CarruselComponent } from "../carrusel.component";
import { ProductosComponent } from "../productos.component/productos.component";
import { EncargoServices } from '../../services/encargo.services';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ContactComponent,
    CarruselComponent,
    ProductosComponent
],
  template: `
  <!-- Aqui va el carrucel -->
    <section id="carrusel">
      <carrusel-component />
    </section>
    <section id="productos">
      <productos-component />
    </section>
    <section id="contacto">
      <app-contact />
    </section>
  `
})
export class HomePageComponent {

  constructor (){}
}