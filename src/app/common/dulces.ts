import { Dulce } from "../interfaces/dulces.interfaces";

//Tipos de dulces:
export let tipos_de_dulces: Dulce[] = [
  {
    id: 1,
    nombre: "Charolas surtida",
    precio: 1000,
    imagen: getImageUrl("Charolas surtida.jpg")
  },
  {
    id: 2,
    nombre: "Panetela Grande",
    precio: 3500,
    imagen: getImageUrl("Panetela media fresa.jpg")
  },
  {
    id: 3,
    nombre: "Panetela Grande de Chocolate",
    precio: 5500,
    imagen: getImageUrl("Panetela grande chocolate.jpg")
  },
  {
    id: 4,
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