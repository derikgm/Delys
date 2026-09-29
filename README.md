# Delys

Sitio web de Delys, una pastelería de dulces artesanales. Permite ver el catálogo
de dulces y armar un pedido indicando cantidad, dulce, fecha y horario de entrega.

Hecho con [Angular](https://angular.dev) 22, Tailwind CSS 4 y la librería de
iconos [ng-icons](https://www.ngicons.com).

## Puesta en marcha

```bash
npm install
npm start
```

La app queda disponible en `http://localhost:4200/`.

## Comandos

| Comando          | Descripción                                               |
| ---------------- | --------------------------------------------------------- |
| `npm start`      | Levanta el servidor de desarrollo con recarga en caliente |
| `npm run build`  | Compila para producción en `dist/Delys/`                  |
| `npm run watch`  | Compila en modo desarrollo y recompila al guardar         |
| `npm test`       | Ejecuta las pruebas unitarias con Vitest                  |
| `npm run deploy` | Compila y publica en GitHub Pages                         |

## Estructura del proyecto

```
src/
├── index.html
├── main.ts                      Arranque de la aplicación
├── styles.css                   Paleta de marca y estilos globales
├── assets/                      Imágenes de los productos
└── app/
    ├── app.ts                   Componente raíz: encabezado, contenido y pie
    ├── app.config.ts            Proveedores globales (router, HTTP)
    ├── app.routes.ts            Rutas
    ├── comunes/                 Utilidades compartidas
    │   ├── imagenes.ts          Rutas de imágenes y detección de entorno
    │   └── indicador-carga.component.ts
    ├── datos/                   Configuración editable sin tocar componentes
    │   ├── api.ts               URL del backend según el entorno
    │   └── contacto.ts          Teléfono, WhatsApp y correo
    ├── modelos/                 Interfaces de datos
    │   └── dulces.modelo.ts
    ├── servicios/
    │   └── encargo.servicio.ts  Catálogo de dulces y estado del pedido
    └── componentes/
        ├── encabezado.component.ts
        ├── pie-pagina.component.ts
        ├── carrusel.component.ts
        ├── boton-whatsapp.component.ts
        ├── paginas/
        │   └── pagina-inicio.component.ts
        ├── productos/
        │   ├── productos.component.ts
        │   └── productos.component.html
        └── secciones/
            ├── nosotros.component.ts
            ├── contacto.component.ts
            └── encargo/         Flujo para armar y confirmar un pedido
                ├── encargo.component.ts
                ├── encargo.component.html
                └── componentes/
                    ├── tarjeta-encargo.component.ts
                    ├── selector-dulce.component.ts
                    └── validar-encargo.component.ts
```

## Convenciones

- Nombres de archivos, clases y variables en español, con `camelCase` para
  variables y métodos y `PascalCase` para clases.
- Los componentes usan `ChangeDetectionStrategy.OnPush` y `signal` para el estado.
- Selectores de elementos con el prefijo `app-`.

## Datos editables

Lo que cambia con frecuencia está en `src/app/datos/`:

- `contacto.ts` → número de WhatsApp, mensaje inicial, teléfono y correo.
- `api.ts` → URL del backend, según el entorno (local o publicado).

## Publicación

El sitio se publica en GitHub Pages mediante `npm run deploy`, que compila con
`baseHref` en `/Delys/`. El catálogo de dulces y los pedidos consumen una API
externa; su URL se selecciona automáticamente según el entorno en
`src/app/datos/api.ts`.
