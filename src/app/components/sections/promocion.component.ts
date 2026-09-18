import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-promocion',
  standalone: true,
  template: `
    <section class="py-8">
      <p
        (click)="abrirDialog()"
        class="text-center hover:text-green-700 transition-colors cursor-pointer"
      >
        ¿Quieres una página como esta? ¡Clickea aquí!
      </p>
    </section>

    <dialog
    #dialogRef
    class="rounded-xl p-0 backdrop:bg-black/50 max-w-md w-[90vw]
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0"
    (click)="cerrarSiEsFondo($event)"
    >
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">
          ¡Construimos tu sitio web!
        </h2>
        <p class="text-gray-700 mb-6">
          Construimos tu sitio web según tus especificaciones, solo contacte con el número
          <span class="font-bold text-green-700">+53 58920775</span>
        </p>
        <div class="flex justify-end gap-2">
          <button
            (click)="cerrarDialog()"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cerrar
          </button>
          <a
            href="https://wa.me/58920775?text=Hola,%20quiero%20una%20p%C3%A1gina%20web"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </dialog>
  `
})
export class PromocionComponent {
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  abrirDialog() {
    this.dialogRef.nativeElement.showModal();
  }

  cerrarDialog() {
    this.dialogRef.nativeElement.close();
  }

  cerrarSiEsFondo(event: MouseEvent) {
    // Solo cierra si el clic fue directamente sobre el <dialog> (backdrop)
    if (event.target === this.dialogRef.nativeElement) {
      this.cerrarDialog();
    }
  }
}