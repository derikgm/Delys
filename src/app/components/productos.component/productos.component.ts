import { Component, inject, signal } from '@angular/core';
import { Dulce } from '../../interfaces/dulces.interfaces';
// import { tipos_de_dulces } from '../../common/dulces';
import { NgStyle } from '@angular/common';
import { EncargoServices } from '../../services/encargo.services';
import { ServerSpingComponent } from "../../common/sping.component";

@Component({
  selector: 'productos-component',
  templateUrl: 'productos.component.html',
  imports: [ServerSpingComponent],
})
export class ProductosComponent {
  // ofertas = tipos_de_dulces;
  
  encargo_services = inject(EncargoServices)

  ofertas = this.encargo_services.tipos_de_dulces;

  mostrar_todos = signal(false);

  constructor () {

  }

}
