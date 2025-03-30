import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';


const routes: Routes = [
  {
    path: 'user',
    loadChildren: () =>
      import('./user-management/user-management.module').then(m => m.UserManagementModule)
  },
  {
    path: 'catalog',
    loadChildren: () =>
      import('./catalog/catalog.module').then(m => m.CatalogModule)
  },

 {
   path: 'producto/:id'
   , component: ProductDetailComponent },

  {
    path: 'shopping-cart',
    loadChildren: () =>
      import('./shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule)
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./payment/payment.module').then(m => m.PaymentModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
