import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 1. Importa el componente
import { UserEditComponent } from './user-management/components/user-edit/user-edit.component';
import { UserListComponent } from './user-management/components/user-list/user-list.component';
// 2. Importa el guard
import { AuthGuard } from '@app/guards/auth.guard';

const routes: Routes = [
  { 
    path: 'user-management', 
    loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule) 
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