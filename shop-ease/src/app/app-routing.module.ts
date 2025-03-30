import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { UserEditComponent } from './user-management/components/user-edit/user-edit.component';
import { UserListComponent } from './user-management/components/user-list/user-list.component';
import { AuthGuard } from '@app/guards/auth.guard';


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
    // Ruta para edición de usuario
  {
    path: 'user-edit/:id',
    component: UserEditComponent,
    canActivate: [AuthGuard] // Protege la ruta
  },
  {
    path: 'user-list',
    component: UserListComponent
  },
  // Redirección por defecto (opcional)
  { path: '', redirectTo: '/user-management/login', pathMatch: 'full' },
  // Ruta comodín (opcional)
  { path: '**', redirectTo: '/user-management/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
