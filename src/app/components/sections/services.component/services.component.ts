import { Component, computed, inject, OnInit, signal, } from '@angular/core';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { matAdd } from '@ng-icons/material-icons/baseline';
import { Dulce } from '../../../interfaces/dulces.interfaces';
import { tipos_de_dulces } from '../../../common/dulces';
import { EncargoServices } from '../../../services/encargo.services';
import { EncargoComponent } from "./components/card-encargo.component";
import { ValidarEncargoComponent } from "./components/validar-encargo.component";

@Component({
  selector: 'app-services',
  standalone: true,
  providers: [
    provideIcons({
      agregar: matAdd,
    })
  ],
  templateUrl: 'services.compoment.html',
  imports: [NgIcon, EncargoComponent, ValidarEncargoComponent]
})
export class ServicesComponent implements OnInit {

  encargo_services = inject(EncargoServices);
  mostrarDialog = signal(false);

  precio = computed<number>(() => {
    let precio = 0;
    this.encargos().forEach((e) => {precio += (e.dulce.precio * e.cantidad)})
    return precio;
  })

  tipos_de_dulces: Dulce[] = [];

  encargos = this.encargo_services.encargos;

  ngOnInit(): void {
    this.tipos_de_dulces.push(...tipos_de_dulces);
  }

  abrirDialog() {
    this.mostrarDialog.set(true);
  }

  // Método para cerrar el dialog
  cerrarDialog() {
    this.mostrarDialog.set(false);
  }

  // Método para confirmar el pedido
  confirmarPedido(datos: any) {
    console.log('Pedido confirmado:', datos);
    // Aquí envías los datos a tu backend
    this.mostrarDialog.set(false);
  }

  // Método para agregar un nuevo encargo
  agregar_encargo() {
    this.encargos.update((encargos) => {
      return [
        ...encargos,
        {
          dulce: this.tipos_de_dulces[0], // Por defecto el primer dulce
          cantidad: 1,
        }
      ];
    });
  }

  // En tu componente principal
  validar_encargo(): boolean {
    // Verifica que haya al menos un encargo
    if (this.encargos().length === 0) {
      // Puedes mostrar un toast o alerta
      alert('Debes agregar al menos un dulce');
      return false;
    }
    
    // Verifica que todos los encargos tengan cantidad > 0
    const encargosInvalidos = this.encargos().some(e => e.cantidad <= 0);
    if (encargosInvalidos) {
      alert('Todos los dulces deben tener una cantidad mayor a 0');
      return false;
    }
    
    return true;
  }

  grid_classes(){
    //Estandar
    let clase = "";
    
    if(this.encargos().length <= 1)
      clase = "flex justify-center";
    
    if(this.encargos().length < 4 && this.encargos().length >= 2)
      clase = "grid grid-cols-1 sm:grid-cols-2 gap-4";
    
    if(this.encargos().length >= 4)
      clase = "grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 sm:grid-cols-2"

    return clase
  }
}
