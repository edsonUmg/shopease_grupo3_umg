import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  productos: any[] = []; // Aquí cargarás los productos desde el JSON

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Simulación de carga desde JSON (puedes reemplazarlo con una petición HTTP)
    this.productos = [
      { nombre: 'iPhone 14 Pro', precio: 1499, imagen: 'iphone14pro.png' },
      { nombre: 'iPhone 11', precio: 550, imagen: 'iphone11.png' }
    ];
  }

  agregarAlCarrito(producto: any) {
    this.cartService.agregarProducto(producto);
    alert(`${producto.nombre} agregado al carrito`);
  }
}
