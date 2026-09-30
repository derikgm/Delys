# Delys — notas de contexto

> **Para quién es este archivo:** para una IA (o una persona) que va a trabajar
> este repositorio **junto con el repositorio del backend** (`derikgm-msf-nestjs`,
> NestJS). La sección [6. Contrato con el backend](#6-contrato-con-el-backend) es la
> parte que más importa: define exactamente qué espera el frontend.

---

## 1. Qué es

Sitio web de **Delys**, una pastelería de dulces artesanales en **Cuba**.
Permite ver el catálogo de dulces y armar un pedido indicando cantidad, dulce,
fecha de entrega, dirección y teléfono.

- Idioma de la UI y del código: **español** (nombres de archivos, clases, variables).
- Mercado: Cuba. Moneda **CUP**, prefijo telefónico **+53**, zona horaria **UTC-5**.
  Esto último es importante, ver [fechas y zona horaria](#fechas-y-zona-horaria).

No es una app con rutas: es un **one-page**. La única ruta real es `''`, y todo lo
demás redirige a ella (`app.routes.ts`). La navegación entre secciones es por
anclas (`#productos`, `#encargo`, `#radicamos`, `#contacto`).

---

## 2. Stack

| Pieza | Versión | Notas |
| --- | --- | --- |
| Angular | `22.0.x` | Standalone components, signals, `input()`/`output()`, control flow con `@if`/`@for` |
| Tailwind CSS | `4.1.x` | v4: se configura con `@theme` en CSS, **no** con `tailwind.config.js` (ese archivo quedó vacío de efecto) |
| PostCSS | `8.5.x` | Solo `@tailwindcss/postcss` |
| ng-icons | `@ng-icons/core` + `material-icons` | Iconos como `provideIcons({...})` en cada componente |
| TypeScript | `~6.0.2` | |
| Vitest | `4.1.x` | Corredor de tests, vía `@angular/build:unit-test` |
| RxJS | `~7.8.0` | Solo `HttpClient.subscribe()` |
| Deploy | `angular-cli-ghpages` | GitHub Pages |

### Cosas de Angular 22 que conviene saber

- **`ChangeDetectionStrategy.OnPush` ya es el default.** Los componentes que lo
  declaran explícitamente (`tarjeta-encargo`, `carrusel`, `indicador-carga`) lo
  hacen por costumbre/herencia del schematics; el resto también es OnPush.
- **No hay `zone.js`.** La app es zoneless. Por eso el estado va en `signal`, y los
  componentes que mutan datos mutables (`datos` del formulario) dependen de los
  eventos de `ngModel` para disparar la detección.
- **No hay ESLint.** Solo Prettier (`.prettierrc`: comillas simples, 100 cols).
- **`strict: true` NO está activo** en `tsconfig.json`. Solo hay
  `strictInjectionParameters` y `strictInputAccessModifiers`.

---

## 3. Comandos

```bash
npm install
npm start      # ng serve  -> http://localhost:4200/
npm run build  # producción -> dist/Delys/
npm test       # Vitest (32 tests)
npm run deploy # build + publica en GitHub Pages
```

> **Importante sobre los tests:** corren en la zona horaria del sistema. Para
> cubrir el caso real de Cuba hay que forzarla:
> `TZ=America/Havana npm test`. Ver [fechas y zona horaria](#fechas-y-zona-horaria).

---

## 4. Estructura

```
src/
├── index.html
├── main.ts
├── styles.css                  @theme con la paleta de marca + estilos globales
├── assets/                     48 fotos de producto (nombre = nombre del dulce)
└── app/
    ├── app.ts                  raíz: encabezado + contenido + pie
    ├── app.config.ts           providers (router, HttpClient con withFetch)
    ├── app.routes.ts           una sola ruta
    ├── app.spec.ts             todos los tests (un solo archivo)
    ├── comunes/
    │   ├── imagenes.ts         resolución de imágenes + detección de entorno
    │   └── indicador-carga.component.ts
    ├── datos/                  ⭐ config editable sin tocar componentes
    │   ├── api.ts              URLs del backend
    │   └── contacto.ts         teléfono, WhatsApp, correo
    ├── modelos/
    │   └── dulces.modelo.ts    ⭐ todas las interfaces
    ├── servicios/
    │   └── encargo.servicio.ts ⭐ estado global + toda la capa HTTP
    └── componentes/
        ├── encabezado.component.ts        (menú + scroll suave)
        ├── pie-pagina.component.ts
        ├── carrusel.component.ts          (autoplay, pausa con visibilitychange)
        ├── boton-whatsapp.component.ts    (existe pero NO está montado en app.ts)
        ├── paginas/pagina-inicio.component.ts
        ├── productos/productos.component.ts + .html
        └── secciones/
            ├── nosotros.component.ts
            ├── contacto.component.ts
            └── encargo/
                ├── encargo.component.ts + .html      (orquestador)
                └── componentes/
                    ├── tarjeta-encargo.component.ts    (cantidad + cambiar/quitar)
                    ├── selector-dulce.component.ts     (modal con buscador)
                    └── validar-encargo.component.ts    (modal con el formulario)
```

### Arquitectura en una frase

`App` → `PaginaInicioComponent` (dispara `init()` del catálogo una sola vez) →
secciones. `EncargoComponent` orquesta el flujo de pedido y delega el estado a
`ServicioEncargos`, que es el único que habla con la API.

---

## 5. Convenciones

- Nombres **en español**: archivos, clases, variables y métodos.
- `camelCase` para variables, funciones y métodos; `PascalCase` solo para clases.
- Selectores con prefijo `app-`.
- Estado con `signal`/`computed`, nunca con `BehaviorSubject`.
- Comentarios y documentación en español, con `/** */` en lo público.
- Prettier: comillas simples, `printWidth: 100`.

---

## 6. Contrato con el backend

### 6.1 Dónde está la configuración

`src/app/datos/api.ts` — **este es el único lugar donde cambia la URL**:

```ts
const API_DESARROLLO  = 'http://localhost:3000/delys';
const API_PRODUCCION  = 'https://derikgm-msf-nestjs.wasmer.app/delys';

export const urlApi = esModoDesarrollo() ? API_DESARROLLO : API_PRODUCCION;
```

> ⚠️ **Trampa importante.** `esModoDesarrollo()` (en `comunes/imagenes.ts`) **no
> detecta un modo de build**: compara el hostname contra `derikgm.github.io`.
> ```
> esModoDesarrollo() === (window.location.hostname !== 'derikgm.github.io')
> ```
> Consecuencias:
> - `ng serve` en `localhost` → API de desarrollo. Correcto.
> - Publicado en `derikgm.github.io` → API de producción. Correcto.
> - **Cualquier otro host** (preview de PR, `127.0.0.1`, un dominio propio, un
>   `file://`) apunta a `localhost:3000` y a rutas `/assets/`, y queda roto.
>
> Si el backend necesita probarse en otro dominio, hay que tocar esto primero
> (lo pendiente sería usar `import.meta.env` o *file replacements* de `angular.json`).

### 6.2 `GET /delys/dulces`

Devuelve el catálogo. El frontend **no acepta otra forma**:

```jsonc
{
  "dulces": [
    {
      "id": 1,
      "nombre": "Charolas surtida",
      "precio": 1000,
      "imagen_url": "https://<proyecto>.supabase.co/storage/v1/object/public/<bucket>/charolas.jpg",
      "imagen_bytes": null
    }
  ]
}
```

Requisitos:

| Campo | Tipo | Obligatorio | Notas |
| --- | --- | --- | --- |
| `id` | `number` | sí | Único. Se usa para identifying y para `dulce_id` del pedido |
| `nombre` | `string` | sí | Se muestra tal cual |
| `precio` | `number` | sí | Número plano en CUP. **Sin símbolo ni separador de miles** (`1000`, no `"1.000 CUP"`) |
| `imagen_url` | `string \| null` | sí (la clave) | URL **completa** de Supabase Storage. Ver abajo |
| `imagen_bytes` | `string \| null` | sí (la clave) | Ver abajo |

**Sobre las imágenes.** El frontend resuelve la imagen con esta prioridad
(`comunes/imagenes.ts` → `resolverImagenDulce`):

1. `imagen_url` → se usa tal cual.
2. `imagen_bytes` → se convierte a `data:image/jpeg;base64,<bytes>`. Si ya viene
   como data URI (`data:image/png;base64,...`) no se le añade otro prefijo.
3. Si **ambas** vienen en `null` → se recurre a `src/assets/<nombre>.jpg`.

Consecuencias prácticas:

- **`imagen_url` debe ser una URL absoluta** (`https://...`). Si devuelve una ruta
  relativa tipo `/delys/imagenes/1.jpg`, en GitHub Pages faltaría el prefijo
  `/Delys` y la imagen no cargaría.
- Si el backend usa **Supabase Storage**, encaja directo: las *public URLs* del
  bucket ya son absolutas. Basta con devolver `imagen_url` y dejar
  `imagen_bytes` en `null`.
- El punto 3 es un **plan B**: mientras `imagen_url` y `imagen_bytes` vengan en
  `null`, el catálogo sigue mostrando las 48 fotos que hay en `src/assets`.
  OJO: ese plan B busca el archivo **por nombre exacto y sensible a mayúsculas**
  (`Charolas surtida.jpg`). Si el nombre del backend no coincide exactamente con
  el archivo, sale la imagen rota.

**Tolerancia a respuestas raras.** `init()` no revienta si la respuesta viene sin
la lista:

```ts
const dulces = respuesta?.dulces ?? [];   // en vez dedulces.map(...)
```

### 6.3 `POST /delys/pedido`

Lo manda `ServicioEncargos.enviarPedido()`. Cuerpo exacto:

```jsonc
{
  "direccion": "Calle 23 #45, La Habana",
  "telefono": "51234567",
  "fecha": "2026-10-05",
  "notas": "Dejar en recepción",
  "encargos": [
    { "dulce_id": 1, "cantidad": 2 },
    { "dulce_id": 3, "cantidad": 1 }
  ]
}
```

| Campo | Tipo | Notas |
| --- | --- | --- |
| `direccion` | `string` | `trim()` applied |
| `telefono` | `string` | **Sin `+53`**, solo el número. `trim()` aplicado |
| `fecha` | `string` | `YYYY-MM-DD`, ya en la zona horaria del cliente (ver más abajo) |
| `notas` | `string` | Puede ir vacía. `trim()` aplicado |
| `encargos` | `LineaPedido[]` | Al menos 1 elemento |

`LineaPedido` = `{ dulce_id: number, cantidad: number }`.

**Decisiones que el backend debe conocer:**

- **No se manda `total`.** Se quitó del contrato a propósito: el precio lo
  recalcula el backend desde el catálogo, así el cliente no puede manipularlo.
  El frontend solo lo muestra como *estimado* (`precioTotal`).
- **No se manda el dulce entero, solo `dulce_id` + `cantidad`.** Mandar el objeto
  completo arrastraría `imagen`, y con `imagen_bytes` en base64 un pedido podría
  pesar varios MB.
- **No se manda `horario`.** Se retiró del formulario; el backend define la hora
  de entrega.
- **`nombre` en `snake_case`** para los campos que replican el JSON del backend
  (`imagen_url`, `imagen_bytes`, `dulce_id`). Si el endpoint espera `dulceId` en
  camelCase, se cambia `LineaPedido` en `modelos/dulces.modelo.ts` y el `.map()`
  en `validar-encargo.component.ts`.

**Cómo el frontend reacciona al resultado:**

| Respuesta | Qué pasa |
| --- | --- |
| Éxito (cualquier `2xx`) | El diálogo se cierra, el carrito se vacía, sale el banner *✅ ¡Pedido enviado!* |
| Error (cualquier `4xx`/`5xx`) | El diálogo **permanece abierto** con los datos escritos, se muestra *No pudimos enviar tu pedido…*, y el carrito se conserva |

O sea: **el frontend no necesita que la respuesta tenga cuerpo**. Solo importa el
status code. Si el backend quiere devolver el id del pedido creado, hay que añadir
un campo a la respuesta y leerlo en `enviarPedido()`.

---

## 7. Modelos de datos

Todos en `src/app/modelos/dulces.modelo.ts`.

### `DulceCatalogo` — lo que devuelve el backend

```ts
interface DulceCatalogo {
  id: number;
  precio: number;
  nombre: string;
  imagen_url: string | null;    // snake_case: refleja el JSON del backend
  imagen_bytes: string | null;
}
```

### `Dulce` — lo que usan las vistas

```ts
interface Dulce {
  id: number;
  precio: number;
  nombre: string;
  rebaja?: number;   // ⚠️ declarado pero NUNCA usado por la UI
  imagen?: string;   // ya resuelta (URL, data URI o ruta local)
}
```

`ServicioEncargos.aDulceVisible()` convierte `DulceCatalogo` → `Dulce` aplicando
`resolverImagenDulce`. Las plantillas solo conocen `Dulce`.

### `Encargo` — una línea del carrito, en memoria

```ts
interface Encargo { dulce: Dulce; cantidad: number; }
```

### `LineaPedido` / `DatosPedido` — lo que viaja al backend

Ver [6.3](#63-post-delyspedido).

### `FechaRapida`

```ts
interface FechaRapida { etiqueta: string; dias: number; }
```

---

## 8. Datos editables (sin tocar componentes)

`src/app/datos/`:

- **`contacto.ts`** → `numeroContacto` (`'55905717'`, sin prefijo), `prefijoTelefono`
  (`'+53'`), `mensajeContacto`, `correoContacto`, y los enlaces ya armados:
  `telefonoVisible`, `telefonoLink`, `correoLink`, `contactoLink` (WhatsApp).
- **`api.ts`** → las dos URLs de la API (ver [6.1](#61-dónde-está-la-configuración)).

`src/styles.css` → la paleta de marca en `@theme`:
`--color-delys-primary: #4c5d3b`, `-secondary: #8fa37f`, `-tertiary: #c6d3bb`,
`-light: #f3efe6`, `-accent: #da4f37`, `--color-texto: #2d2d2d`.

> ⚠️ La paleta está duplicada como hex literales dentro de
> `validar-encargo.component.ts` (`#4C5D3B`, `#DA4F37`, `#C6D3BB`…) y hay
> `green-500`/`green-700` sueltos en vez del accent de marca. Deuda conocida.

---

## 9. Comportamientos importantes (y trampas)

### Fechas y zona horaria

**Regla: toda fecha se maneja en hora local, nunca en UTC.** Ya se corrigió un bug
serio por romper esto, así que **no reintroducirlo**:

```ts
// ✅ correcto
function aIso(fecha: Date): string {          // usa getFullYear/getMonth/getDate
  ...
}
function desdeIso(iso: string): Date {        // new Date(anio, mes-1, dia)
  ...
}

// ❌ prohibido
fecha.toISOString().split('T')[0]   // convierte a UTC
new Date('2026-10-01')              // parsea como medianoche UTC
```

Por qué importa: en Cuba (UTC-5), entre las 19:00 y la medianoche,
`toISOString()` adelantaba un día, y `new Date('2026-10-01')` caía en el 30. El
efecto era que **la fecha mínima que el propio campo ofrecía era rechazada** con
*"No puedes seleccionar una fecha anterior a mañana"*.

Consecuencias del contrato:

- `fechaMinima` = mañana; `fechaMaxima` = dentro de 15 días (constantes
  `DIAS_MINIMOS` / `DIAS_MAXIMOS`).
- **`fecha` sale del frontend ya resuelta en la zona del cliente.** El backend
  debería guardarla como fecha pura (día), no como instante. Si la almacena como
  `TIMESTAMP`, un cliente en Cuba y otro en Madrid pueden generar el mismo día con
  instantes distintos.

`DatePipe` de Angular **no** sufre el problema: su `toDate()` detecta `YYYY-MM-DD`
y construye una fecha local. Los `{{ datos.fecha | date:'dd/MM/yyyy' }}` del
template son seguros.

Hay 7 tests dedicados a esto en `app.spec.ts`. Si alguien toca las fechas,
corran con `TZ=America/Havana npm test` para tener cobertura real.

### Detección de entorno

`esModoDesarrollo()` compara hostname contra `derikgm.github.io` y **controla dos
cosas a la vez**: la URL de la API *y* el prefijo de las imágenes
(`/assets/...` vs `/Delys/assets/...`). Ver la advertencia en [6.1](#61-dónde-está-la-configuración).

### Estado del pedido

- Vive en `ServicioEncargos` (`providedIn: 'root'`), o sea **sobrevive a la
  navegación pero NO a un refresco de página**. No hay persistencia.
- `agregarEncargo()` siempre mete **el primer dulce del catálogo**. Si se agregan
  dos encargos sin tocar la imagen, quedan duplicados.
- `errorValidacion` bloquea el botón *PEDIR ENCARGO* si no hay encargos o si
  alguna cantidad es `<= 0`.
- El diálogo de confirmación **no se cierra al enviar**: el cierre depende de que
  el backend acepte el pedido (vía `effect` sobre `pedidoEnviado()`). Así, si el
  envío falla, el cliente no pierde lo que escribió.

### Carga del catálogo

`ServicioEncargos.init()` se llama una sola vez desde el constructor de
`PaginaInicioComponent`. Si el backend falla, `cargandoDulces` pasa a `false` y el
catálogo queda vacío; **no hay mensaje de error visible**, solo `console.error`. El
botón *Agregar un encargo* queda visible pero no hace nada (sale en silencio si el
catálogo está vacío).

---

## 10. Estado actual

### Hecho

- Catálogo de dulces (grid, "ver todos", imágenes)
- Carrito: agregar, cambiar dulce, cambiar cantidad, eliminar
- Formulario de pedido: dirección, teléfono, fecha de entrega (con validación y
  accesos rápidos), notas
- Envío real del pedido por `POST /delys/pedido`, con estado de carga, error y
  confirmación
- Carrusel con autoplay, encabezado con menú responsive, sección de contacto

### Pendiente

- **`GET /delys/dulces` en producción responde `HTTP 200` con cuerpo de 0 bytes.**
  Verificado el 30/09/2026. El sitio publicado muestra el catálogo vacío.
- El backend todavía se está programando.
- `NosotrosComponent` solo tiene el título *"Radicamos en"* — falta la dirección,
  un mapa o una imagen.
- `BotonWhatsappComponent` existe pero **no está montado** en `app.ts` (está
  comentado). Decidir si se activa.
- No hay confirmación de pedido visible más allá del banner: sin resumen,
  sin número de pedido, sin pantalla de "gracias".
- No hay autenticación, ni panel para ver pedidos.

---

## 11. Tests

Un solo archivo: `src/app/app.spec.ts` (32 tests), corredor **Vitest**.

| Bloque | Qué cubre |
| --- | --- |
| `App` | Montaje y presencia de las secciones |
| `ServicioEncargos` | Agregar/cambiar/eliminar encargos, catálogo vacío |
| `obtenerUrlImagen` / `esModoDesarrollo` | Rutas de imagen y detección de entorno |
| `datos de contacto` | Enlace de WhatsApp bien codificado |
| `resolverImagenDulce` | Las 4 ramas: url, bytes, data URI, fallback |
| `ServicioEncargos.init` | Endpoint, mapeo del payload, respuesta sin `dulces` |
| `ValidarEncargoComponent` | Fechas locales (7 tests) y payload emitido |
| `enviarPedido` | URL, método, body, éxito y error |

Se usa `HttpTestingController` para la capa HTTP. Para tocar los tests:

```bash
npm test
TZ=America/Havana npm test   #Recommended: cubre el caso de Cuba
```

> El test de `esModoDesarrollo` es **tautológico** (compara la función contra su
> propia implementación), así que no detecta nada. Deuda conocida.

---

## 12. Despliegue

- GitHub Pages vía `angular-cli-ghpages`.
- `baseHref: '/Delys/'` (el sitio vive en `derikgm.github.io/Delys/`).
- Salida: `dist/Delys/browser/`.
- **La carpeta `docs/` está versionada en git** y contiene una build antigua del
  sitio. Coexiste con la rama `gh-pages`. Conviene decidir cuál es la fuente de
  verdad.
- **El favicon da 404**: `index.html` lo pide en la raíz pero `angular.json` solo
  incluye `assets: ["src/assets"]`; `public/favicon.ico` nunca se copia.

---

## 13. Deuda técnica conocida

- `esModoDesarrollo()` frágil (ver [6.1](#61-dónde-está-la-configuración)).
- Sin estado de error visible cuando falla el catálogo.
- `* { transition: all 0.2s ease; }` global en `styles.css`: anima todo el DOM.
- Favicon 404; `docs/` duplicada y desactualizada; `notas.txt` versionado por error.
- Sin ESLint; `strict: true` desactivado.
- Modales sin `role="dialog"`, sin `aria-modal`, sin cerrar con `Escape` ni *focus trap*.
- Paleta de marca duplicada en hex dentro de componentes.
- `Dulce.rebaja` declarado y nunca usado.
- `total` y `totalDe()` siguen mostrándose en pantalla aunque ya no se envían
  (correcto: es una estimación visible, no parte del contrato).