import { Dulce } from "../interfaces/dulces.interfaces";

//Tipos de dulces:
export let tipos_de_dulces: Dulce[] = [
  {
    nombre: 'Chocoflan con merenge',
    precio: 4500,
  },
  {
    nombre: 'Flan mediano (15 cm)',
    precio: 2000,
  },
  {
    nombre: 'Flan Grande (18 cm)',
    precio: 3000,
  },
  {
    nombre: "Charolas surtida",
    precio: 1000,
    imagen: getImageUrl("Charolas surtida.jpg")
  },
  {
    nombre: "Panetela Grande",
    precio: 3500,
    imagen: getImageUrl("Panetela media fresa.jpg")
  },
  {
    nombre: "Panetela Grande de Chocolate",
    precio: 5500,
    imagen: getImageUrl("Panetela grande chocolate.jpg")
  },
  {
    nombre: "Panetela Grande con cobertura de flores",
    precio: 4700,
    imagen: getImageUrl("Panetela grande con rosas.jpg")
  },

]

export function getImageUrl(imageName: string): string {
  // Detectar si estamos en producción y en GitHub Pages
  if (window.location.hostname === 'derikgm.github.io') {
    return `/Delys/assets/${imageName}`;
  }
  return `/assets/${imageName}`;
}

// src/assets/Charolas surtida.jpg
// src/assets/Panetela Grande.jpg
// src/assets/Panetela media 1.jpg
// src/assets/Panetela media 2.jpg