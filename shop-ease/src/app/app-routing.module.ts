import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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
