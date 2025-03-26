import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  favorites: number[] = [];
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.productos = data;
      this.productosFiltrados = data;
    });
  }

  toggleFavorite(product: any): void {
    const index = this.favorites.indexOf(product.id);
    if (index === -1) {
      this.favorites.push(product.id);
    } else {
      this.favorites.splice(index, 1);
    }
  }
  isFavorite(product: any): boolean {
    return this.favorites.includes(product.id);
  }

  agregarAlCarrito(producto: Product): void {
    this.cartService.agregarProducto(producto);
    alert(`${producto.name} agregado al carrito`);
  }
  
  filtrarPorDisponibilidad(event: any): void {
    if (event.target.checked) {
      this.productosFiltrados = this.productos.filter((p) => p.available);
    } else {
      this.productosFiltrados = [...this.productos];
    }
  }
  
}
