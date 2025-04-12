import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  carrito: Product[] = [];

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.carrito = this.cartService.obtenerCarrito();
  }

  limpiarCarrito(): void {
    this.cartService.limpiarCarrito();
    this.carrito = [];
  }

  irAPago(): void {
    this.router.navigate(['/payment']);
  }

}
