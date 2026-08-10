import { Component } from '@angular/core';
import { provideIcons, NgIcon } from "@ng-icons/core";
import { matWhatsappOutline } from '@ng-icons/material-icons/outline';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      whatsap: matWhatsappOutline
    })
  ],
  template: `
    <section class="relative h-screen flex items-center justify-center bg-domus-primary text-white">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-bold mb-4 text-blue-800">DOMUS</h1>
        <p class="text-xl md:text-3xl mb-8 font-bold text-blue-900 shadow-lg rounded-md
        bg-white/50 px-3 py-2"
        style="text-wrap: balance;"
        >Cuidamos tu hogar como si fuera nuestro</p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <!-- Botón WhatsApp -->
          <a href="https://wa.me/5211234567890?text=Hola%20DOMUS!%20Quiero%20un%20presupuesto" 
             target="_blank"
             class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg 
             font-semibold transition-all flex items-center justify-center gap-2">
             <ng-icon name="whatsap" class="text-3xl"/>
             <span class="text-xl">Whatsapp</span>
          </a>
          
          <!-- Botón Solicitar presupuesto CON BORDE ANIMADO -->
          <div class="relative p-0.75 rounded-lg overflow-hidden group">
            <!-- Borde animado (solo el borde, no el fondo) -->
            <div class="absolute inset-0 rounded-lg animate-border-rotate"></div>
            
            <!-- Contenido del botón (estático) -->
            <a href="#contacto"
               class="relative bg-domus-accent hover:text-blue-700 text-domus-primary 
               px-8 py-4 rounded-lg font-semibold transition-all flex items-center 
               justify-center gap-2 text-xl hover:bg-yellow-500
               text-blue-800 bg-yellow-400">
              Solicitar presupuesto
            </a>
          </div>
        </div>
      </div>

      <!-- Imagen de fondo -->
      <img src="/assets/hero-bg.jpg" 
           alt="DOMUS Hero" 
           class="absolute inset-0 w-full h-full object-cover"
           loading="lazy">
    </section>

  `
})
export class HomeComponent {}