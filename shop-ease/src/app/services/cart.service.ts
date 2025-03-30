import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carrito: Product[] = [];

  constructor() {}

  agregarProducto(producto: Product) {
    this.carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  obtenerCarrito(): Product[] {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  limpiarCarrito() {
    this.carrito = [];
    localStorage.removeItem('carrito');
  }
}
