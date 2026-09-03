// validar-encargo.component.ts
import { Component, inject, signal, output, input, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'validar-encargo-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Fondo oscuro con blur -->
    <div 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      (click)="cerrar()">
      
      <!-- Panel del dialog -->
      <div 
        class="bg-[#F3EFE6] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="border-b border-[#C6D3BB] px-6 py-4 sticky top-0 bg-[#F3EFE6] rounded-t-2xl z-10">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🍰</span>
              <h3 class="text-2xl font-bold text-[#4C5D3B]">
                Confirmar Encargo
              </h3>
            </div>
            <button 
              (click)="cerrar()"
              class="text-[#8FA37F] hover:text-[#DA4F37] transition-colors p-2 hover:bg-[#C6D3BB]/20 rounded-full">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-[#8FA37F] mt-1 font-medium">Compartimos sabores · Celebramos la vida</p>
        </div>

        <!-- Body -->
        <div class="px-6 py-6 space-y-6">
          
          <!-- Resumen de dulces -->
          <div>
            <h4 class="text-lg font-semibold text-[#4C5D3B] mb-3 flex items-center gap-2">
              <span>🍬</span> Dulces a encargar
            </h4>
            <div class="bg-white/80 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto border border-[#C6D3BB]">
              @for (encargo of encargos(); track $index) {
                <div class="flex justify-between items-center py-2 border-b border-[#C6D3BB] last:border-0">
                  <span class="text-[#4C5D3B] font-medium">{{encargo.dulce.nombre}}</span>
                  <p class="font-semibold text-[#DA4F37]">
                    x{{encargo.cantidad}} | {{encargo.cantidad * encargo.dulce.precio}} CUP
                  </p>
                </div>
              }
            </div>
            <div class="mt-3 text-right">
              <span class="text-lg font-bold text-[#DA4F37]">
                Total: {{precioTotal()}} CUP
              </span>
            </div>
          </div>

          <!-- Formulario -->
          <form #formulario="ngForm" (ngSubmit)="onSubmit(formulario)" class="space-y-4">
            
            <!-- Dirección -->
            <div>
              <label class="block text-sm font-medium text-[#4C5D3B] mb-1">
                📍 Dirección de entrega *
              </label>
              <textarea
                required
                [(ngModel)]="datos.direccion"
                name="direccion"
                rows="2"
                placeholder="Escribe tu dirección completa..."
                class="w-full px-4 py-2 rounded-lg border border-[#C6D3BB] focus:border-[#4C5D3B] focus:ring-2 focus:ring-[#4C5D3B]/20 transition-all resize-none bg-white/80">
              </textarea>
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-[#4C5D3B] mb-1">
                📱 Número de teléfono *
              </label>
              <div class="flex w-full">
                <p class="border rounded-l-lg border-[#C6D3BB] items-center flex px-3 select-none bg-white/80 text-[#4C5D3B] font-medium">
                  +53 
                </p>
                <input
                  required
                  type="tel"
                  [(ngModel)]="datos.telefono"
                  name="telefono"
                  placeholder="5XXXXXXXX"
                  class="w-full px-4 py-2 rounded-r-lg border border-[#C6D3BB] border-l-0 
                  focus:border-[#4C5D3B] focus:ring-2 focus:ring-[#4C5D3B]/20 transition-all bg-white/80">
              </div>
            </div>

            <!-- Fecha y hora de entrega -->
            <div class="space-y-4 bg-white/60 rounded-xl p-5 border border-[#C6D3BB]">
              
              <!-- Título decorativo -->
              <div class="flex items-center gap-2 mb-3">
                <span class="text-2xl">📅</span>
                <h4 class="text-lg font-semibold text-[#4C5D3B]">Programa tu entrega</h4>
                <span class="ml-auto text-xs bg-[#DA4F37] text-white px-2 py-1 rounded-full font-medium">
                  Requerido
                </span>
              </div>

              <!-- Fecha -->
              <div class="select-none">
                <label class="text-sm font-medium text-[#4C5D3B] mb-1.5 flex items-center gap-1">
                  <span>📆</span> Día de entrega *
                  <span class="text-xs text-[#8FA37F] ml-2">(Mínimo 1 día de anticipación)</span>
                </label>
                
                <!-- Selector de fecha personalizado -->
                <div class="relative">
                  <input
                    type="date"
                    [(ngModel)]="datos.fecha"
                    name="fecha"
                    [min]="fechaMinima()"
                    [max]="fechaMaximaString()"
                    (change)="validarFecha()"
                    class="hidden"
                    #fechaInput>
                  
                  <div class="flex gap-2">
                    <button
                      type="button"
                      (click)="abrirSelectorFecha(fechaInput)"
                      class="flex-1 px-4 py-2.5 rounded-lg border-2 border-[#C6D3BB] focus:border-[#4C5D3B] focus:ring-4 focus:ring-[#4C5D3B]/20 transition-all bg-white/80 hover:bg-[#F3EFE6] flex items-center justify-between"
                      [class.border-[#DA4F37]]="fechaInvalida() && datos.fecha">
                      <span class="flex items-center gap-2">
                        <span class="text-xl">📅</span>
                        <span class="text-[#4C5D3B]">
                          {{ datos.fecha ? (datos.fecha | date:'dd/MM/yyyy') : 'Seleccionar fecha' }}
                        </span>
                      </span>
                      <span class="text-[#8FA37F]">▼</span>
                    </button>
                    
                    @if (datos.fecha) {
                      <button
                        type="button"
                        (click)="limpiarFecha(fechaInput)"
                        class="px-3 py-2.5 rounded-lg border-2 border-[#C6D3BB] hover:border-[#DA4F37] hover:bg-[#DA4F37]/10 transition-all"
                        title="Limpiar fecha">
                        <span class="text-[#DA4F37]">✕</span>
                      </button>
                    }
                  </div>
                  
                  <!-- Botones de fecha rápida -->
                  <div class="flex gap-2 mt-2 flex-wrap">
                    @for (fechaRapida of fechasRapidas; track fechaRapida.label) {
                      <button
                        type="button"
                        (click)="seleccionarFechaRapida(fechaRapida.dias, fechaInput)"
                        class="px-3 py-1.5 text-xs rounded-full border border-[#C6D3BB] hover:bg-[#C6D3BB] hover:border-[#4C5D3B] transition-all text-[#4C5D3B] hover:text-[#4C5D3B]"
                        [class.bg-[#C6D3BB]]="fechaRapida.dias === 1 && datos.fecha === fechaMinima()">
                        {{fechaRapida.label}}
                      </button>
                    }
                  </div>
                </div>
                
                <!-- Mensaje de error o advertencia -->
                @if (fechaInvalida() && datos.fecha) {
                  <div class="mt-2 flex items-center gap-2 text-[#DA4F37] text-sm bg-[#DA4F37]/10 p-2 rounded-lg border border-[#DA4F37]/20">
                    <span class="text-lg">⚠️</span>
                    <span>{{mensajeError()}}</span>
                  </div>
                } @else if (datos.fecha && !fechaInvalida()) {
                  <div class="mt-2 flex items-center gap-2 text-[#4C5D3B] text-sm bg-[#C6D3BB]/30 p-2 rounded-lg border border-[#C6D3BB]">
                    <span class="text-lg">✅</span>
                    <span>Fecha disponible para entrega</span>
                  </div>
                }
              </div>

              <!-- Franja horaria -->
              <div>
                <label class="text-sm font-medium text-[#4C5D3B] mb-1.5 flex items-center gap-1">
                  <span>🕐</span> Horario de entrega *
                </label>
                <div class="grid grid-cols-2 gap-2">
                  @for (horario of horariosDisponibles; track horario.valor) {
                    <label 
                      class="relative flex items-center justify-center px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all
                      hover:scale-[1.02] active:scale-[0.98]
                      [&:has(input:checked)]:border-[#4C5D3B] [&:has(input:checked)]:bg-[#C6D3BB]/30 [&:has(input:checked)]:shadow-md
                      border-[#C6D3BB] bg-white/60 hover:border-[#4C5D3B]"
                      [class.border-[#4C5D3B]]="datos.horario === horario.valor"
                      [class.bg-[#C6D3BB]/30]="datos.horario === horario.valor">
                      
                      <input
                        type="radio"
                        required
                        [(ngModel)]="datos.horario"
                        name="horario"
                        [value]="horario.valor"
                        class="hidden">
                      
                      <span class="flex items-center gap-2 text-sm font-medium text-[#4C5D3B]">
                        <span>{{horario.icono}}</span>
                        {{horario.etiqueta}}
                      </span>
                      
                      @if (datos.horario === horario.valor) {
                        <span class="absolute -top-2 -right-2 bg-[#4C5D3B] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          ✓
                        </span>
                      }
                    </label>
                  }
                </div>
              </div>

              <!-- Notas adicionales -->
              <div class="pt-3 border-t border-[#C6D3BB]">
                <label class="text-sm font-medium text-[#4C5D3B] mb-1.5 flex items-center gap-1">
                  <span>💬</span> Notas adicionales
                  <span class="text-xs text-[#8FA37F] ml-2">(Opcional)</span>
                </label>
                <textarea
                  [(ngModel)]="datos.notas"
                  name="notas"
                  rows="2"
                  placeholder="Ej: Dejar en recepción, llamar al llegar, etc..."
                  class="w-full px-4 py-2 rounded-lg border border-[#C6D3BB] focus:border-[#4C5D3B] focus:ring-4 focus:ring-[#4C5D3B]/20 transition-all resize-none bg-white/80">
                </textarea>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#C6D3BB]">
              <button 
                type="button"
                (click)="cerrar()"
                class="flex-1 px-4 py-2.5 bg-white/80 hover:bg-[#C6D3BB]/30 text-[#4C5D3B] font-medium rounded-lg transition-all border border-[#C6D3BB] hover:border-[#4C5D3B]">
                Cancelar
              </button>
              <button 
                type="submit"
                [disabled]="formulario.invalid"
                class="flex-1 px-4 py-2.5 bg-[#4C5D3B] hover:bg-[#3A4A2E] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
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
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
    .animate-slideUp {
      animation: slideUp 0.3s ease-out;
    }
  `]
})
export class ValidarEncargoComponent {
  encargos = input<any[]>([]);
  precioTotal = input.required<number>();
  
  cerrarDialog = output<void>();
  confirmarPedido = output<any>();
  
  cerrar() {
    this.cerrarDialog.emit();
  }
  
  fechaInvalida = signal(false);
  mensajeError = signal('');

  horariosDisponibles = [
    { valor: 'manana', etiqueta: 'Mañana (9am-12pm)', icono: '🌅' },
    { valor: 'tarde', etiqueta: 'Tarde (12pm-5pm)', icono: '☀️' },
    { valor: 'noche', etiqueta: 'Noche (5pm-8pm)', icono: '🌙' }
  ];

  fechasRapidas = [
    { label: '📦 2 días', dias: 2 },
    { label: '📦 3 días', dias: 3 },
    { label: '📦 1 semana', dias: 7 }
  ];

  datos = {
    direccion: '',
    telefono: '',
    fecha: '',
    horario: '',
    notas: ''
  };

  fechaMinima = computed(() => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);
    return hoy.toISOString().split('T')[0];
  });

  fechaMaxima = computed(() => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 15);
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  });

  fechaMaximaString = computed(() => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 15);
    return hoy.toISOString().split('T')[0];
  });

  abrirSelectorFecha(inputElement: HTMLInputElement) {
    if (inputElement) {
      inputElement.showPicker ? inputElement.showPicker() : inputElement.click();
    }
  }

  limpiarFecha(inputElement: HTMLInputElement) {
    this.datos.fecha = '';
    this.fechaInvalida.set(false);
    this.mensajeError.set('');
    if (inputElement) {
      inputElement.value = '';
    }
  }

  seleccionarFechaRapida(dias: number, inputElement: HTMLInputElement) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    const fechaStr = fecha.toISOString().split('T')[0];
    this.datos.fecha = fechaStr;
    if (inputElement) {
      inputElement.value = fechaStr;
    }
    this.validarFecha();
  }

  validarFecha() {
    this.fechaInvalida.set(false);

    if (!this.datos.fecha) {
      return;
    }

    const fechaSeleccionada = new Date(this.datos.fecha);
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    
    fechaSeleccionada.setHours(0, 0, 0, 0);
    manana.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < manana) {
      this.fechaInvalida.set(true);
      this.mensajeError.set('❌ No puedes seleccionar una fecha anterior a mañana');
    } else if (fechaSeleccionada > this.fechaMaxima()) {
      this.fechaInvalida.set(true);
      this.mensajeError.set('❌ Solo puedes programar entregas con 15 días de anticipación');
    } else {
      this.fechaInvalida.set(false);
      this.mensajeError.set('');
    }
  }

  onSubmit(form: any) {
    if (form.valid && !this.fechaInvalida()) {
      this.confirmarPedido.emit({
        ...this.datos,
        encargos: this.encargos(),
        total: this.precioTotal(),
        fechaFormateada: this.datos.fecha ? new DatePipe('es').transform(this.datos.fecha, 'dd/MM/yyyy') : null
      });
      this.cerrar();
    } else if (this.fechaInvalida()) {
      alert('Por favor, selecciona una fecha válida para la entrega');
    }
  }
}