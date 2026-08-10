import { Component } from '@angular/core';

@Component({
  selector: 'app-store',
  standalone: true,
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-domus-primary mb-12">Nuestra Tienda</h2>

        @if (products.length > 0) {
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (product of products; track product.id) {
              <div class="bg-domus-light rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2">
                <img [src]="product.image" 
                     [alt]="product.name" 
                     class="w-full h-56 object-cover"
                     loading="lazy">
                <div class="p-4">
                  <h3 class="text-xl font-semibold text-domus-primary">{{ product.name }}</h3>
                  <p class="text-gray-700 text-sm mt-1">{{ product.description }}</p>
                  <p class="text-domus-accent font-bold mt-2">{{ product.price }}</p>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-12">
            <p class="text-gray-500 text-lg">Próximamente más productos</p>
          </div>
        }
      </div>
    </section>
  `
})
export class StoreComponent {
  products = [
    { 
      id: 1,
      name: 'Kit de limpieza ecológica', 
      description: 'Productos biodegradables para tu hogar.', 
      price: '450', 
      image: 'assets/producto1.jpg' 
    },
    { 
      id: 2,
      name: 'Aromatizante natural', 
      description: 'Fragancias sin químicos para ambientes saludables.', 
      price: '280', 
      image: 'assets/producto2.jpg' 
    },
    { 
      id: 3,
      name: 'Set de organización', 
      description: 'Cajas y separadores para ordenar tus espacios.', 
      price: '650', 
      image: 'assets/producto3.jpg' 
    }
  ];
}