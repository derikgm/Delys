import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { NgForm } from '@angular/forms';

import { App } from './app';
import { rutas } from './app.routes';
import { ServicioEncargos } from './servicios/encargo.servicio';
import { obtenerUrlImagen, esModoDesarrollo, resolverImagenDulce } from './comunes/imagenes';
import { contactoLink, mensajeContacto, numeroContacto } from './datos/contacto';
import { DatosPedido, DulceCatalogo, Encargo } from './modelos/dulces.modelo';
import { ValidarEncargoComponent } from './componentes/secciones/encargo/componentes/validar-encargo.component';

/** Fecha en `YYYY-MM-DD` tal como la ve el usuario, usando su calendario local. */
function isoLocal(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

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

describe('resolverImagenDulce', () => {
  const dulce: DulceCatalogo = {
    id: 1,
    nombre: 'Charolas surtida',
    precio: 1000,
    imagen_url: null,
    imagen_bytes: null,
  };

  it('usa imagen_url cuando el backend la envía', () => {
    const resultado = resolverImagenDulce({
      ...dulce,
      imagen_url: 'https://ejemplo.com/charolas.jpg',
      imagen_bytes: 'aW1hZ2Vu',
    });

    expect(resultado).toBe('https://ejemplo.com/charolas.jpg');
  });

  it('reconstruye la imagen con los bytes en base64 cuando no hay url', () => {
    const resultado = resolverImagenDulce({ ...dulce, imagen_bytes: 'aW1hZ2Vu' });

    expect(resultado).toBe('data:image/jpeg;base64,aW1hZ2Vu');
  });

  it('no duplica el prefijo si los bytes ya vienen como data URI', () => {
    const resultado = resolverImagenDulce({
      ...dulce,
      imagen_bytes: 'data:image/png;base64,aW1hZ2Vu',
    });

    expect(resultado).toBe('data:image/png;base64,aW1hZ2Vu');
  });

  it('recurre al archivo de assets cuando el backend no manda ninguna imagen', () => {
    expect(resolverImagenDulce(dulce)).toBe(obtenerUrlImagen('Charolas surtida'));
  });

  it('ignora url y bytes vacíos', () => {
    const resultado = resolverImagenDulce({ ...dulce, imagen_url: '  ', imagen_bytes: '' });

    expect(resultado).toBe(obtenerUrlImagen('Charolas surtida'));
  });
});

describe('ServicioEncargos.init con el payload del backend', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('pide el endpoint de dulces y guarda el catálogo con la imagen resuelta', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    const ctrl = TestBed.inject(HttpTestingController);

    servicio.init();

    const peticion = ctrl.expectOne((r) => r.url.endsWith('/dulces'));
    expect(peticion.request.method).toBe('GET');

    peticion.flush({
      dulces: [
        {
          id: 1,
          nombre: 'Charolas surtida',
          precio: 1000,
          imagen_url: 'https://ejemplo.com/charolas.jpg',
          imagen_bytes: null,
        },
      ],
    });

    expect(servicio.tiposDeDulces()).toEqual([
      {
        id: 1,
        nombre: 'Charolas surtida',
        precio: 1000,
        imagen: 'https://ejemplo.com/charolas.jpg',
      },
    ]);
    expect(servicio.cargandoDulces()).toBe(false);
  });

  it('deja el catálogo vacío y apaga el indicador si la respuesta no trae dulces', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    const ctrl = TestBed.inject(HttpTestingController);

    servicio.init();
    ctrl.expectOne((r) => r.url.endsWith('/dulces')).flush({});

    expect(servicio.tiposDeDulces()).toEqual([]);
    expect(servicio.cargandoDulces()).toBe(false);
  });
});

/**
 * Estas pruebas deben correr con la zona horaria del usuario, no en UTC.
 * Con `TZ=America/Havana npm test` cubren el caso real del sitio.
 */
describe('ValidarEncargoComponent - fechas locales', () => {
  function crearComponente(encargos: Encargo[] = []): ValidarEncargoComponent {
    const fixture = TestBed.createComponent(ValidarEncargoComponent);
    fixture.componentRef.setInput('encargos', encargos);
    fixture.componentRef.setInput('precioTotal', 0);
    return fixture.componentInstance;
  }

  function elegir(component: ValidarEncargoComponent, iso: string): void {
    component.datos.fecha = iso;
    component.validarFecha();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ValidarEncargoComponent] });
  });

  it('ofrece como mínimo mañana y como máximo dentro de 15 días', () => {
    const componente = crearComponente();

    expect(componente.fechaMinima()).toBe(isoLocal(1));
    expect(componente.fechaMaxima()).toBe(isoLocal(15));
  });

  it('acepta la fecha mínima que el propio campo ofrece', () => {
    const componente = crearComponente();

    elegir(componente, componente.fechaMinima());

    expect(componente.fechaInvalida()).toBe(false);
    expect(componente.mensajeError()).toBe('');
  });

  it('acepta la fecha máxima', () => {
    const componente = crearComponente();

    elegir(componente, componente.fechaMaxima());

    expect(componente.fechaInvalida()).toBe(false);
  });

  it('acepta una fecha del medio del rango', () => {
    const componente = crearComponente();

    elegir(componente, isoLocal(7));

    expect(componente.fechaInvalida()).toBe(false);
  });

  it('rechaza hoy y cualquier fecha anterior', () => {
    const componente = crearComponente();

    elegir(componente, isoLocal(0));
    expect(componente.fechaInvalida()).toBe(true);
    expect(componente.mensajeError()).toContain('anterior a mañana');

    elegir(componente, isoLocal(-3));
    expect(componente.fechaInvalida()).toBe(true);
  });

  it('rechaza más de 15 días de anticipación', () => {
    const componente = crearComponente();

    elegir(componente, isoLocal(16));

    expect(componente.fechaInvalida()).toBe(true);
    expect(componente.mensajeError()).toContain('15 días');
  });

  it('las fechas rápidas elegidas pasan la validación', () => {
    const componente = crearComponente();
    const campo = document.createElement('input');

    for (const dias of [2, 3, 7]) {
      componente.seleccionarFechaRapida(dias, campo);
      expect(componente.fechaInvalida()).toBe(false);
      expect(componente.datos.fecha).toBe(isoLocal(dias));
    }
  });

  it('emite solo los campos que pide el backend, sin horario ni total', () => {
    const componente = crearComponente([
      { dulce: { id: 1, nombre: 'Charolas', precio: 1000 }, cantidad: 2 },
    ]);

    componente.datos.direccion = '  Calle 23  ';
    componente.datos.telefono = ' 51234567 ';
    componente.datos.fecha = isoLocal(3);
    componente.datos.notas = '  Sin azúcar  ';

    let emitido: DatosPedido | null = null;
    componente.pedidoConfirmado.subscribe((pedido) => (emitido = pedido));

    componente.enviar({ valid: true } as NgForm);

    expect(emitido).toEqual({
      direccion: 'Calle 23',
      telefono: '51234567',
      fecha: isoLocal(3),
      notas: 'Sin azúcar',
      encargos: [{ dulce_id: 1, cantidad: 2 }],
    });
  });

  it('no cierra el diálogo al enviar: el cierre depende del backend', () => {
    const componente = crearComponente();

    let cerrado = false;
    componente.cerrarDialogo.subscribe(() => (cerrado = true));

    componente.enviar({ valid: true } as NgForm);

    expect(cerrado).toBe(false);
  });

  it('no emite nada si el formulario es inválido', () => {
    const componente = crearComponente();

    let emitido = false;
    componente.pedidoConfirmado.subscribe(() => (emitido = true));

    componente.enviar({ valid: false } as NgForm);

    expect(emitido).toBe(false);
  });
});

describe('ServicioEncargos.enviarPedido', () => {
  const pedido: DatosPedido = {
    direccion: 'Calle 23',
    telefono: '51234567',
    fecha: '2026-10-05',
    notas: '',
    encargos: [{ dulce_id: 1, cantidad: 2 }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('hace POST a /pedido con el cuerpo del pedido', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    const ctrl = TestBed.inject(HttpTestingController);

    servicio.enviarPedido(pedido);

    const peticion = ctrl.expectOne((r) => r.url.endsWith('/pedido'));
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual(pedido);
    expect(servicio.enviandoPedido()).toBe(true);

    peticion.flush({});
    expect(servicio.enviandoPedido()).toBe(false);
  });

  it('vacía el pedido y avisa cuando el backend lo acepta', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    const ctrl = TestBed.inject(HttpTestingController);

    servicio.tiposDeDulces.set([{ id: 1, nombre: 'Charolas', precio: 1000 }]);
    servicio.agregarEncargo();
    servicio.enviarPedido(pedido);

    ctrl.expectOne((r) => r.url.endsWith('/pedido')).flush({});

    expect(servicio.pedidoEnviado()).toBe(true);
    expect(servicio.errorPedido()).toBe(null);
    expect(servicio.encargos()).toEqual([]);
  });

  it('conserva el pedido y muestra un error si el envío falla', () => {
    const servicio = TestBed.inject(ServicioEncargos);
    const ctrl = TestBed.inject(HttpTestingController);

    servicio.tiposDeDulces.set([{ id: 1, nombre: 'Charolas', precio: 1000 }]);
    servicio.agregarEncargo();
    servicio.enviarPedido(pedido);

    ctrl
      .expectOne((r) => r.url.endsWith('/pedido'))
      .flush(null, { status: 500, statusText: 'Error del servidor' });

    expect(servicio.pedidoEnviado()).toBe(false);
    expect(servicio.errorPedido()).toBeTruthy();
    expect(servicio.enviandoPedido()).toBe(false);
    expect(servicio.encargos()).toHaveLength(1);
  });
});
