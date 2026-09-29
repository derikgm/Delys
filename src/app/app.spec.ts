import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';

import { App } from './app';
import { rutas } from './app.routes';
import { ServicioEncargos } from './servicios/encargo.servicio';
import { obtenerUrlImagen, esModoDesarrollo } from './comunes/imagenes';
import { contactoLink, mensajeContacto, numeroContacto } from './datos/contacto';

/**
 * Prueba de humo: monta la aplicación completa.
 * Si falta algún proveedor (por ejemplo el de HttpClient), el render falla.
 */
describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(rutas), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('se crea sin errores de inyección de dependencias', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('expone las secciones principales del sitio', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-encabezado')).toBeTruthy();
    expect(compiled.querySelector('app-pagina-inicio')).toBeTruthy();
    expect(compiled.querySelector('app-pie-pagina')).toBeTruthy();
  });
});

describe('ServicioEncargos', () => {
  it('inicia con el catálogo vacío y el indicador de carga activo', () => {
    const servicio = TestBed.inject(ServicioEncargos);

    expect(servicio.tiposDeDulces()).toEqual([]);
    expect(servicio.cargandoDulces()).toBe(true);
  });

  it('agrega un encargo con el primer dulce y la cantidad 1', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    servicio.tiposDeDulces.set([
      { id: 1, nombre: 'Charolas surtida', precio: 1000 },
      { id: 2, nombre: 'Panetela', precio: 3500 },
    ]);

    servicio.agregarEncargo();

    expect(servicio.encargos()).toEqual([{ dulce: servicio.tiposDeDulces()[0], cantidad: 1 }]);
  });

  it('cambia la cantidad de un encargo por su índice', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    servicio.tiposDeDulces.set([{ id: 1, nombre: 'Charolas surtida', precio: 1000 }]);
    servicio.agregarEncargo();
    servicio.agregarEncargo();

    servicio.cambiarCantidad(1, 4);

    expect(servicio.encargos()[1].cantidad).toBe(4);
    expect(servicio.encargos()[0].cantidad).toBe(1);
  });

  it('no agrega un encargo si el catálogo está vacío', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    servicio.tiposDeDulces.set([]);

    servicio.agregarEncargo();

    expect(servicio.encargos()).toEqual([]);
  });

  it('elimina el encargo indicado', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    servicio.tiposDeDulces.set([{ id: 1, nombre: 'Charolas', precio: 1000 }]);
    servicio.agregarEncargo();
    servicio.agregarEncargo();

    servicio.eliminarEncargo(0);

    expect(servicio.encargos()).toHaveLength(1);
  });
});

describe('obtenerUrlImagen', () => {
  it('devuelve la ruta con extensión .jpg', () => {
    expect(obtenerUrlImagen('Charolas surtida')).toMatch(/\.jpg$/);
  });

  it('no duplica la extensión si ya viene incluida', () => {
    expect(obtenerUrlImagen('Charolas surtida.jpg')).toMatch(/\.jpg$/);
  });

  it('detecta el entorno de desarrollo fuera de GitHub Pages', () => {
    expect(esModoDesarrollo()).toBe(window.location.hostname !== 'derikgm.github.io');
  });
});

describe('datos de contacto', () => {
  it('arma el enlace de WhatsApp con el número y el mensaje codificado', () => {
    expect(contactoLink).toBe(
      `https://wa.me/${numeroContacto}?text=${encodeURIComponent(mensajeContacto)}`,
    );
  });

  it('codifica los espacios del mensaje para no romper la URL', () => {
    expect(contactoLink).not.toContain(' ');
    expect(decodeURIComponent(contactoLink.split('text=')[1])).toBe(mensajeContacto);
  });
});
