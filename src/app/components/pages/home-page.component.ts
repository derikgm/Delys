import { Component } from '@angular/core';
import { HomeComponent } from '../sections/home.component';
import { AboutComponent } from '../sections/about.component';
import { ContactComponent } from '../sections/contact.component';
// import { GalleryComponent } from '../sections/gallery.component';
import { ServicesComponent } from '../sections/services.component/services.component';
import { CarruselComponent } from "../carrusel.component";
import { ProductosComponent } from "../productos.component/productos.component";
// import { StoreComponent } from '../sections/store.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    // HomeComponent,
    AboutComponent,
    ServicesComponent,
    // StoreComponent,
    // GalleryComponent,
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
    <section id="encargo">
      <app-services />
    </section>

    <section id="radicamos">
      <app-about />
    </section>
    <section id="contacto">
      <app-contact />
    </section>
  `
})
export class HomePageComponent {}