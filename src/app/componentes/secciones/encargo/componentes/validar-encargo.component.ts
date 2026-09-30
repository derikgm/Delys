import { DatePipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosPedido, Encargo, FechaRapida } from '../../../../modelos/dulces.modelo';

/** Días de anticipación mínimos para aceptar un pedido. */
const DIAS_MINIMOS = 1;

/** Días de anticipación máximos que se pueden programar. */
const DIAS_MAXIMOS = 15;

/** Accesos rápidos para elegir fecha de entrega. */
const FECHAS_RAPIDAS: FechaRapida[] = [
  { etiqueta: '📦 2 días', dias: 2 },
  { etiqueta: '📦 3 días', dias: 3 },
  { etiqueta: '📦 1 semana', dias: 7 },
];

@Component({
  selector: 'app-validar-encargo',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      (click)="cerrar()"
    >
      <div
        class="bg-[#F3EFE6] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        (click)="$event.stopPropagation()"
      >
        <!-- Encabezado -->
        <div
          class="border-b border-[#C6D3BB] px-6 py-4 sticky top-0 bg-[#F3EFE6] rounded-t-2xl z-10"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🍰</span>
              <h3 class="text-2xl font-bold text-[#4C5D3B]">Confirmar Encargo</h3>
            </div>
            <button
              type="button"
              (click)="cerrar()"
              aria-label="Cerrar"
              class="text-[#8FA37F] hover:text-[#DA4F37] transition-colors p-2 hover:bg-[#C6D3BB]/20 rounded-full"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p class="text-sm text-[#8FA37F] mt-1 font-medium">
            Compartimos sabores · Celebramos la vida
          </p>
        </div>

        <!-- Contenido -->
        <div class="px-6 py-6 space-y-6">
          <!-- Resumen del pedido -->
          <div>
            <h4 class="text-lg font-semibold text-[#4C5D3B] mb-3 flex items-center gap-2">
              <span>🍬</span> Dulces a encargar
            </h4>
            <div
              class="bg-white/80 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto border border-[#C6D3BB]"
            >
              @for (encargo of encargos(); track $index) {
                <div
                  class="flex justify-between items-center py-2 border-b border-[#C6D3BB] last:border-0"
                >
                  <span class="text-[#4C5D3B] font-medium">{{ encargo.dulce.nombre }}</span>
                  <p class="font-semibold text-[#DA4F37]">
                    x{{ encargo.cantidad }} | {{ totalDe(encargo) }} CUP
                  </p>
                </div>
              }
            </div>
            <div class="mt-3 text-right">
              <span class="text-lg font-bold text-[#DA4F37]">Total: {{ precioTotal() }} CUP</span>
            </div>
          </div>

          <form #formularioPedido="ngForm" (ngSubmit)="enviar(formularioPedido)" class="space-y-4">
            <!-- Dirección -->
            <div>
              <label class="block text-sm font-medium text-[#4C5D3B] mb-1" for="direccion">
                📍 Dirección de entrega *
              </label>
              <textarea
                id="direccion"
                required
                [(ngModel)]="datos.direccion"
                name="direccion"
                rows="2"
                placeholder="Escribe tu dirección completa..."
                class="w-full px-4 py-2 rounded-lg border border-[#C6D3BB] focus:border-[#4C5D3B]
                       focus:ring-2 focus:ring-[#4C5D3B]/20 transition-all resize-none bg-white/80"
              ></textarea>
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-[#4C5D3B] mb-1" for="telefono">
                📱 Número de teléfono *
              </label>
              <div class="flex w-full">
                <p
                  class="border rounded-l-lg border-[#C6D3BB] items-center flex px-3 select-none
                         bg-white/80 text-[#4C5D3B] font-medium"
                >
                  +53
                </p>
                <input
                  id="telefono"
                  required
                  type="tel"
                  [(ngModel)]="datos.telefono"
                  name="telefono"
                  placeholder="5XXXXXXXX"
                  class="w-full px-4 py-2 rounded-r-lg border border-[#C6D3BB] border-l-0
                         focus:border-[#4C5D3B] focus:ring-2 focus:ring-[#4C5D3B]/20 transition-all bg-white/80"
                />
              </div>
            </div>

            <!-- Fecha y hora de entrega -->
            <div class="space-y-4 bg-white/60 rounded-xl p-5 border border-[#C6D3BB]">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-2xl">📅</span>
                <h4 class="text-lg font-semibold text-[#4C5D3B]">Programa tu entrega</h4>
                <span
                  class="ml-auto text-xs bg-[#DA4F37] text-white px-2 py-1 rounded-full font-medium"
                >
                  Requerido
                </span>
              </div>

              <!-- Fecha -->
              <div class="select-none">
                <label
                  class="text-sm font-medium text-[#4C5D3B] mb-1.5 flex items-center gap-1"
                  for="fecha"
                >
                  <span>📆</span> Día de entrega *
                  <span class="text-xs text-[#8FA37F] ml-2">(Mínimo 1 día de anticipación)</span>
                </label>

                <div class="relative">
                  <!-- Input real oculto: el botón de abajo dispara su selector nativo -->
                  <input
                    id="fecha"
                    type="date"
                    [(ngModel)]="datos.fecha"
                    name="fecha"
                    [min]="fechaMinima()"
                    [max]="fechaMaxima()"
                    (change)="validarFecha()"
                    class="text-transparent absolute w-px h-px opacity-0"
                    #campoFecha
                  />

                  <div class="flex gap-2">
                    <button
                      type="button"
                      (click)="abrirSelectorFecha(campoFecha)"
                      class="flex-1 px-4 py-2.5 rounded-lg border-2 border-[#C6D3BB]
                             focus:border-[#4C5D3B] focus:ring-4 focus:ring-[#4C5D3B]/20
                             transition-all bg-white/80 hover:bg-[#F3EFE6] flex items-center
                             justify-between"
                      [class.border-[#DA4F37]]="fechaInvalida() && datos.fecha"
                    >
                      <span class="flex items-center gap-2">
                        <span class="text-xl">📅</span>
                        <span class="text-[#4C5D3B]">
                          {{
                            datos.fecha ? (datos.fecha | date: 'dd/MM/yyyy') : 'Seleccionar fecha'
                          }}
                        </span>
                      </span>
                      <span class="text-[#8FA37F]">▼</span>
                    </button>

                    @if (datos.fecha) {
                      <button
                        type="button"
                        (click)="limpiarFecha(campoFecha)"
                        class="px-3 py-2.5 rounded-lg border-2 border-[#C6D3BB] hover:border-[#DA4F37]
                               hover:bg-[#DA4F37]/10 transition-all"
                        aria-label="Limpiar fecha"
                        title="Limpiar fecha"
                      >
                        <span class="text-[#DA4F37]">✕</span>
                      </button>
                    }
                  </div>

                  <!-- Fechas rápidas -->
                  <div class="flex gap-2 mt-2 flex-wrap">
                    @for (opcion of fechasRapidas; track opcion.dias) {
                      <button
                        type="button"
                        (click)="seleccionarFechaRapida(opcion.dias, campoFecha)"
                        [class.bg-[#C6D3BB]]="
                          opcion.dias === diasMinimos && datos.fecha === fechaMinima()
                        "
                        class="px-3 py-1.5 text-xs rounded-full border border-[#C6D3BB]
                               hover:bg-[#C6D3BB] hover:border-[#4C5D3B] transition-all text-[#4C5D3B]"
                      >
                        {{ opcion.etiqueta }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Mensaje de validación de la fecha -->
                @if (fechaInvalida() && datos.fecha) {
                  <div
                    class="mt-2 flex items-center gap-2 text-[#DA4F37] text-sm bg-[#DA4F37]/10
                           p-2 rounded-lg border border-[#DA4F37]/20"
                  >
                    <span class="text-lg">⚠️</span>
                    <span>{{ mensajeError() }}</span>
                  </div>
                } @else if (datos.fecha && !fechaInvalida()) {
                  <div
                    class="mt-2 flex items-center gap-2 text-[#4C5D3B] text-sm bg-[#C6D3BB]/30
                           p-2 rounded-lg border border-[#C6D3BB]"
                  >
                    <span class="text-lg">✅</span>
                    <span>Fecha disponible para entrega</span>
                  </div>
                }
              </div>

              <!-- Notas -->
              <div class="pt-3 border-t border-[#C6D3BB]">
                <label
                  class="text-sm font-medium text-[#4C5D3B] mb-1.5 flex items-center gap-1"
                  for="notas"
                >
                  <span>💬</span> Notas adicionales
                  <span class="text-xs text-[#8FA37F] ml-2">(Opcional)</span>
                </label>
                <textarea
                  id="notas"
                  [(ngModel)]="datos.notas"
                  name="notas"
                  rows="2"
                  placeholder="Ej: Dejar en recepción, llamar al llegar, etc..."
                  class="w-full px-4 py-2 rounded-lg border border-[#C6D3BB] focus:border-[#4C5D3B]
                         focus:ring-4 focus:ring-[#4C5D3B]/20 transition-all resize-none bg-white/80"
                ></textarea>
              </div>
            </div>

            <!-- Acciones -->
            @if (errorEnvio(); as error) {
              <p
                class="flex items-center justify-center gap-2 text-sm text-[#DA4F37]
                       bg-[#DA4F37]/10 border border-[#DA4F37]/20 p-3 rounded-lg"
                role="alert"
              >
                <span>⚠️</span>
                {{ error }}
              </p>
            }

            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#C6D3BB]">
              <button
                type="button"
                (click)="cerrar()"
                [disabled]="enviando()"
                class="flex-1 px-4 py-2.5 bg-white/80 hover:bg-[#C6D3BB]/30 text-[#4C5D3B]
                       font-medium rounded-lg transition-all border border-[#C6D3BB] hover:border-[#4C5D3B]
                       disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="formularioPedido.invalid || fechaInvalida() || enviando()"
                class="flex-1 px-4 py-2.5 bg-[#4C5D3B] hover:bg-[#3A4A2E] text-white font-medium
                       rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span class="flex items-center justify-center gap-2">
                  @if (enviando()) {
                    <span class="animate-spin">⏳</span> Enviando pedido...
                  } @else {
                    <span>🍰</span> Confirmar Pedido
                  }
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes slideUp {
        from {
          transform: translateY(20px) scale(0.95);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
    `,
  ],
})
export class ValidarEncargoComponent {
  readonly encargos = input.required<Encargo[]>();
  readonly precioTotal = input.required<number>();

  /** `true` mientras el pedido viaja al backend. */
  readonly enviando = input(false);
  /** Mensaje de error del envío, o `null` si no hubo. */
  readonly errorEnvio = input<string | null>(null);

  readonly cerrarDialogo = output<void>();
  readonly pedidoConfirmado = output<DatosPedido>();

  readonly fechasRapidas = FECHAS_RAPIDAS;

  readonly diasMinimos = DIAS_MINIMOS;

  readonly fechaInvalida = signal(false);
  readonly mensajeError = signal('');

  datos = {
    direccion: '',
    telefono: '',
    fecha: '',
    notas: '',
  };

  /** Fecha más próxima que se puede elegir (mañana). */
  readonly fechaMinima = computed(() => aIso(fechaConDiasDesdeHoy(DIAS_MINIMOS)));

  /** Fecha límite para programar la entrega. */
  readonly fechaMaxima = computed(() => aIso(fechaConDiasDesdeHoy(DIAS_MAXIMOS)));

  /** Suma precio × cantidad de un encargo. */
  totalDe(encargo: Encargo): number {
    return encargo.dulce.precio * encargo.cantidad;
  }

  cerrar(): void {
    this.cerrarDialogo.emit();
  }

  abrirSelectorFecha(campo: HTMLInputElement): void {
    campo.showPicker ? campo.showPicker() : campo.click();
  }

  limpiarFecha(campo: HTMLInputElement): void {
    this.datos.fecha = '';
    this.fechaInvalida.set(false);
    this.mensajeError.set('');
    campo.value = '';
  }

  seleccionarFechaRapida(dias: number, campo: HTMLInputElement): void {
    const fecha = aIso(fechaConDiasDesdeHoy(dias));

    this.datos.fecha = fecha;
    campo.value = fecha;
    this.validarFecha();
  }

  validarFecha(): void {
    if (!this.datos.fecha) {
      this.fechaInvalida.set(false);
      this.mensajeError.set('');
      return;
    }

    const elegida = desdeIso(this.datos.fecha);

    if (elegida < fechaConDiasDesdeHoy(DIAS_MINIMOS)) {
      this.fechaInvalida.set(true);
      this.mensajeError.set('❌ No puedes seleccionar una fecha anterior a mañana');
    } else if (elegida > fechaConDiasDesdeHoy(DIAS_MAXIMOS)) {
      this.fechaInvalida.set(true);
      this.mensajeError.set('❌ Solo puedes programar entregas con 15 días de anticipación');
    } else {
      this.fechaInvalida.set(false);
      this.mensajeError.set('');
    }
  }

  enviar(formulario: NgForm): void {
    if (!formulario.valid || this.fechaInvalida() || this.enviando()) {
      return;
    }

    // El diálogo no se cierra aquí: lo cierra quien recibe el pedido, y solo si
    // el backend lo confirma. Así, si falla, el cliente no pierde lo que escribió.
    this.pedidoConfirmado.emit({
      direccion: this.datos.direccion.trim(),
      telefono: this.datos.telefono.trim(),
      fecha: this.datos.fecha,
      notas: this.datos.notas.trim(),
      encargos: this.encargos().map((encargo) => ({
        dulce_id: encargo.dulce.id,
        cantidad: encargo.cantidad,
      })),
    });
  }
}

/** Devuelve, a medianoche local, la fecha de hoy sumando la cantidad de días indicada. */
function fechaConDiasDesdeHoy(dias: number): Date {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

/**
 * Convierte una fecha a `YYYY-MM-DD` con su calendario local.
 * No se usa `toISOString()` porque devuelve la fecha en UTC, que en zonas como
 * Cuba (UTC-5) puede adelantar o atrasar un día respecto a la fecha del usuario.
 */
function aIso(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/**
 * Lee un `YYYY-MM-DD` como fecha local.
 * `new Date(texto)` lo interpretaría como medianoche UTC y en Cuba saltaría al día anterior.
 */
function desdeIso(iso: string): Date {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}
