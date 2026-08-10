import { Component } from '@angular/core';
import { HomeComponent } from '../sections/home.component';
import { AboutComponent } from '../sections/about.component';
import { ContactComponent } from '../sections/contact.component';
// import { GalleryComponent } from '../sections/gallery.component';
import { ServicesComponent } from '../sections/services.component';
// import { StoreComponent } from '../sections/store.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    // StoreComponent,
    // GalleryComponent,
    ContactComponent
  ],
  template: `
    <section id="inicio">
      <app-home />
    </section>
    <section id="servicios">
      <app-services />
    </section>
    <!-- <section id="tienda">
      <app-store />
    </section>
    <section id="galeria">
      <app-gallery />
    </section> -->
    <section id="nosotros">
      <app-about />
    </section>
    <section id="contacto">
      <app-contact />
    </section>
  `
})
export class HomePageComponent {}