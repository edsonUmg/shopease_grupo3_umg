import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit{
  carrito: Product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.carrito = this.cartService.obtenerCarrito();
  }

  limpiarCarrito(): void {
    this.cartService.limpiarCarrito();
    this.carrito = [];
  }

}