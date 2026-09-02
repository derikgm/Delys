import { Component, signal } from '@angular/core';
import { Dulce } from '../../interfaces/dulces.interfaces';
import { tipos_de_dulces } from '../../common/dulces';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'productos-component',
  templateUrl: 'productos.component.html',
})
export class ProductosComponent {
  ofertas = tipos_de_dulces;
  mostrar_todos = signal(false);
}
