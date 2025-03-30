import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../user-management.styles.scss']
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  loading = false;
  hidePassword = true;

  // Getter para acceder fácilmente a los controles del formulario desde el template
  get formControls() {
    return this.loginForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.loading = true;
    const { username, password, rememberMe } = this.loginForm.getRawValue();

    // Validación adicional TypeScript
    if (!username || !password) {
      this.showErrorMessage('Datos del formulario inválidos');
      this.loading = false;
      return;
    }

    this.authService.login({ 
      username: username.trim(), 
      password 
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.handleRememberMe(username, rememberMe || false);
          this.router.navigate(['/user-edit', response.user.id]);
        } else {
          this.showErrorMessage(response.message || 'Credenciales incorrectas');
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Error durante el login';
        this.showErrorMessage(errorMessage);
      }
    });
  }

  private markFormAsTouched(): void {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private handleRememberMe(username: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('rememberedUser', username);
    } else {
      localStorage.removeItem('rememberedUser');
    }
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
