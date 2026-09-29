import { Component, inject } from '@angular/core';
import { NosotrosComponent } from '../secciones/nosotros.component';
import { ContactoComponent } from '../secciones/contacto.component';
import { EncargoComponent } from '../secciones/encargo/encargo.component';
import { CarruselComponent } from '../carrusel.component';
import { ProductosComponent } from '../productos/productos.component';
import { ServicioEncargos } from '../../servicios/encargo.servicio';

@Component({
  selector: 'app-pagina-inicio',
  standalone: true,
  imports: [
    NosotrosComponent,
    EncargoComponent,
    ContactoComponent,
    CarruselComponent,
    ProductosComponent,
  ],
  template: `
    <section id="carrusel">
      <app-carrusel />
    </section>

    <section id="productos">
      <app-productos />
    </section>

    <section id="encargo">
      <app-encargo />
    </section>

    <section id="radicamos">
      <app-nosotros />
    </section>

    <section id="contacto">
      <app-contacto />
    </section>
  `,
})
export class PaginaInicioComponent {
  private readonly servicioEncargos = inject(ServicioEncargos);

  constructor() {
    this.servicioEncargos.init();
  }
}
