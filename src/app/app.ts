import { Component } from '@angular/core';
import { PiePaginaComponent } from './componentes/pie-pagina.component';
import { EncabezadoComponent } from './componentes/encabezado.component';
import { PaginaInicioComponent } from './componentes/paginas/pagina-inicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EncabezadoComponent, PiePaginaComponent, PaginaInicioComponent],
  template: `
    <app-encabezado />
    <main class="pt-16">
      <app-pagina-inicio />
    </main>
    <app-pie-pagina />

    <!-- Botón flotante de WhatsApp: desactivado. Para activarlo, descomenta
         el import de BotonWhatsappComponent y la etiqueta <app-boton-whatsapp />. -->
  `,
})
export class App {}
