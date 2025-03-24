import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carrito: any[] = [];

  constructor() {}

  agregarProducto(producto: any) {
    this.carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  limpiarCarrito() {
    this.carrito = [];
    localStorage.removeItem('carrito');
  }
}
