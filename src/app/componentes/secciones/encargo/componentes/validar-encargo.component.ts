import { DatePipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  DatosPedido,
  Encargo,
  FechaRapida,
  FranjaHoraria,
} from '../../../../modelos/dulces.modelo';

/** Días de anticipación mínimos para aceptar un pedido. */
const DIAS_MINIMOS = 1;

/** Días de anticipación máximos que se pueden programar. */
const DIAS_MAXIMOS = 15;

/** Franjas horarias ofrecidas para la entrega. */
const FRANJAS_HORARIAS: FranjaHoraria[] = [
  { valor: 'manana', etiqueta: 'Mañana (9am-12pm)', icono: '🌅' },
  { valor: 'tarde', etiqueta: 'Tarde (12pm-5pm)', icono: '☀️' },
  { valor: 'noche', etiqueta: 'Noche (5pm-8pm)', icono: '🌙' },
];

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

              <!-- Franja horaria -->
              <div>
                <span class="text-sm font-medium text-[#4C5D3B] mb-1.5 flex items-center gap-1">
                  <span>🕐</span> Horario de entrega *
                </span>
                <div class="grid grid-cols-2 gap-2">
                  @for (franja of franjasHorarias; track franja.valor) {
                    <label
                      class="relative flex items-center justify-center px-4 py-2.5 rounded-lg border-2
                             cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]
                             [&:has(input:checked)]:border-[#4C5D3B] [&:has(input:checked)]:bg-[#C6D3BB]/30
                             [&:has(input:checked)]:shadow-md border-[#C6D3BB] bg-white/60
                             hover:border-[#4C5D3B]"
                      [class.border-[#4C5D3B]]="datos.horario === franja.valor"
                      [class.bg-[#C6D3BB]/30]="datos.horario === franja.valor"
                    >
                      <input
                        type="radio"
                        required
                        [(ngModel)]="datos.horario"
                        name="horario"
                        [value]="franja.valor"
                        class="hidden"
                      />

                      <span class="flex items-center gap-2 text-sm font-medium text-[#4C5D3B]">
                        <span>{{ franja.icono }}</span>
                        {{ franja.etiqueta }}
                      </span>

                      @if (datos.horario === franja.valor) {
                        <span
                          class="absolute -top-2 -right-2 bg-[#4C5D3B] text-white rounded-full w-5 h-5
                                 flex items-center justify-center text-xs"
                        >
                          ✓
                        </span>
                      }
                    </label>
                  }
                </div>
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
            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#C6D3BB]">
              <button
                type="button"
                (click)="cerrar()"
                class="flex-1 px-4 py-2.5 bg-white/80 hover:bg-[#C6D3BB]/30 text-[#4C5D3B]
                       font-medium rounded-lg transition-all border border-[#C6D3BB] hover:border-[#4C5D3B]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="formularioPedido.invalid || fechaInvalida()"
                class="flex-1 px-4 py-2.5 bg-[#4C5D3B] hover:bg-[#3A4A2E] text-white font-medium
                       rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span class="flex items-center justify-center gap-2">
                  <span>🍰</span> Confirmar Pedido
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

  readonly cerrarDialogo = output<void>();
  readonly pedidoConfirmado = output<DatosPedido>();

  readonly franjasHorarias = FRANJAS_HORARIAS;
  readonly fechasRapidas = FECHAS_RAPIDAS;

  readonly diasMinimos = DIAS_MINIMOS;

  readonly fechaInvalida = signal(false);
  readonly mensajeError = signal('');

  datos = {
    direccion: '',
    telefono: '',
    fecha: '',
    horario: '',
    notas: '',
  };

  /** Fecha más próxima que se puede elegir (mañana). */
  readonly fechaMinima = computed(() => this.aIso(FechaConDiasDesdeHoy(DIAS_MINIMOS)));

  /** Fecha límite para programar la entrega. */
  readonly fechaMaxima = computed(() => this.aIso(FechaConDiasDesdeHoy(DIAS_MAXIMOS)));

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
    const fecha = this.aIso(FechaConDiasDesdeHoy(dias));

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

    const elegida = this.alInicioDelDia(new Date(this.datos.fecha));
    const manana = this.alInicioDelDia(FechaConDiasDesdeHoy(DIAS_MINIMOS));
    const limite = this.alInicioDelDia(FechaConDiasDesdeHoy(DIAS_MAXIMOS));

    if (elegida < manana) {
      this.fechaInvalida.set(true);
      this.mensajeError.set('❌ No puedes seleccionar una fecha anterior a mañana');
    } else if (elegida > limite) {
      this.fechaInvalida.set(true);
      this.mensajeError.set('❌ Solo puedes programar entregas con 15 días de anticipación');
    } else {
      this.fechaInvalida.set(false);
      this.mensajeError.set('');
    }
  }

  enviar(formulario: NgForm): void {
    if (!formulario.valid || this.fechaInvalida()) {
      return;
    }

    this.pedidoConfirmado.emit({
      ...this.datos,
      encargos: this.encargos(),
      total: this.precioTotal(),
      fechaFormateada: this.datos.fecha
        ? new DatePipe('es').transform(this.datos.fecha, 'dd/MM/yyyy')
        : null,
    });

    this.cerrar();
  }

  private alInicioDelDia(fecha: Date): Date {
    const copia = new Date(fecha);
    copia.setHours(0, 0, 0, 0);
    return copia;
  }

  private aIso(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }
}

/** Devuelve la fecha de hoy sumando la cantidad de días indicada. */
function FechaConDiasDesdeHoy(dias: number): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}
