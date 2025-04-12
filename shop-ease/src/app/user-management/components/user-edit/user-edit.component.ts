import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { User, ApiResponse } from '@app/models/user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss', '../../user-management.styles.scss']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  isNewUser = true;
  userId: number | null = null;
  user: User | null = null;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isOwnProfile = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['customer', Validators.required],
      shippingAddress: [''],
      billingAddress: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isNewUser = false;
        this.userId = +params['id'];
        this.checkIfOwnProfile(); // Añade esta llamada
        this.loadUser();
      }
    });
  }

  private checkIfOwnProfile(): void {
    const currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData || !this.userId) return;
    
    try {
      const currentUser = JSON.parse(currentUserData);
      this.isOwnProfile = currentUser?.id === this.userId;
    } catch (e) {
      console.error('Error parsing user data', e);
      this.isOwnProfile = false;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  loadUser(): void {
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe({
      next: (response: ApiResponse<User>) => {
        if (response.success && response.data) {
          this.user = response.data;
          this.userForm.patchValue({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            username: response.data.username,
            email: response.data.email,
            phone: response.data.phone,
            role: response.data.role
            // Agregar shippingAddress y billingAddress si existen en el modelo
          });
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar el usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.loading = true;
    const userData = this.userForm.value;

    if (this.isNewUser) {
      this.userService.createUser(userData).subscribe({
        next: (response: ApiResponse<User>) => {
          this.handleResponse(response, 'Usuario creado correctamente');
        },
        error: () => this.handleError('Error al crear usuario'),
        complete: () => this.loading = false
      });
    } else if (this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe({
        next: (response: ApiResponse<User>) => {
          this.handleResponse(response, 'Usuario actualizado correctamente');
        },
        error: () => this.handleError('Error al actualizar usuario'),
        complete: () => this.loading = false
      });
    }
  }
  private checkUserType(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.isOwnProfile = currentUser.id === +params['id'];
      }
    });
  }
  changePassword(): void {
    if (this.passwordForm.invalid || !this.userId) return;

    this.loading = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    // Aquí implementarías el servicio para cambiar contraseña
    // this.userService.changePassword(this.userId, currentPassword, newPassword).subscribe(...)
    // Ejemplo:
    this.snackBar.open('Funcionalidad de cambio de contraseña no implementada', 'Cerrar', { duration: 3000 });
    this.loading = false;
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  private handleResponse(response: ApiResponse<User>, successMessage: string): void {
    if (response.success) {
      this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });
      if (this.isNewUser) {
        this.router.navigate(['/users']);
      }
    } else {
      this.snackBar.open(response.message || 'Operación fallida', 'Cerrar', { duration: 3000 });
    }
  }

  private handleError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
    this.loading = false;
  }
}
