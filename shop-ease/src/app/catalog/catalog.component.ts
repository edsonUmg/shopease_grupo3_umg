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
      this.tipoUsos = [...new Set(data.map((p) => p['byobActivity']).flat())];//aca marca error en p['BYOB - Activity'])
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
        ? p['byobActivity']?.includes(this.tipoUsoSeleccionado)// aca marca error en p['BYOB - Activity']
        : true;

      let cumpleDisponibilidad = this.soloDisponibles ? p.available : true;

      let cumplePrecio =
        (this.precioMin === null || p.price >= this.precioMin) &&
        (this.precioMax === null || p.price <= this.precioMax);

      return cumpleCategoria && cumpleTipoUso && cumpleDisponibilidad && cumplePrecio;
    });
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
