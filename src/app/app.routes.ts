import { Routes } from '@angular/router';
import { PaginaInicioComponent } from './componentes/paginas/pagina-inicio.component';

export const rutas: Routes = [
  { path: '', component: PaginaInicioComponent },
  { path: '**', redirectTo: '' },
];
