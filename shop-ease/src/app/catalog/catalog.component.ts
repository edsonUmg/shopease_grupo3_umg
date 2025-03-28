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

  // Variables para los filtros
  categorias: string[] = [];
  tipoUsos: string[] = [];
  categoriaSeleccionada: string = '';
  tipoUsoSeleccionado: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;
  soloDisponibles: boolean = false;
  productosPorPagina: number = 10; // Cantidad por defecto

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.productos = data;
      this.productosFiltrados = data;

      // Obtener categorías y tipos de uso únicos
      this.categorias = [...new Set(data.map((p) => p.category))];
      this.tipoUsos = [...new Set(data.map((p) => p['byobActivity']).flat())];
    });
  }

  agregarAlCarrito(producto: Product): void {
    this.cartService.agregarProducto(producto);
    alert(`${producto.name} agregado al carrito`);
  }

  // Método para aplicar los filtros
  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter((p) => {
      let cumpleCategoria = this.categoriaSeleccionada
        ? p.category === this.categoriaSeleccionada
        : true;

      let cumpleTipoUso = this.tipoUsoSeleccionado
        ? p['byobActivity']?.includes(this.tipoUsoSeleccionado)
        : true;

      let cumpleDisponibilidad = this.soloDisponibles ? p.available : true;

      let cumplePrecio =
        (this.precioMin === null || p.price >= this.precioMin) &&
        (this.precioMax === null || p.price <= this.precioMax);

      return cumpleCategoria && cumpleTipoUso && cumpleDisponibilidad && cumplePrecio;
    });
  }
  cambiarCantidadProductos() {
    this.aplicarFiltros(); // Recalcula los productos mostrados
  }
  

  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.tipoUsoSeleccionado = '';
    this.precioMin = null;
    this.precioMax = null;
    this.soloDisponibles = false;
    this.productosFiltrados = [...this.productos];
  }
}
