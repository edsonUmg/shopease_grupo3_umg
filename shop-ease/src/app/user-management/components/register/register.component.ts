import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { RegisterData } from '@app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../user-management.styles.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  error: string | null = null;

  // Propiedades para verificación de username/email
  usernameChecked = false;
  usernameAvailable = false;
  emailChecked = false;
  emailAvailable = false;

  // Getter para acceder a los controles del formulario
  get f() {
    return this.registerForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['']
    });
  }

  checkUsername(): void {
    const usernameControl = this.registerForm.get('username');
    if (usernameControl?.valid) {
      this.authService.checkUsernameAvailability(usernameControl.value).subscribe({
        next: (response: { available: boolean }) => {
          this.usernameChecked = true;
          this.usernameAvailable = response.available;
          if (!response.available) {
            usernameControl.setErrors({ notAvailable: true });
          } else {
            usernameControl.setErrors(null);
          }
        },
        error: () => {
          this.usernameChecked = true;
          this.usernameAvailable = false;
          usernameControl?.setErrors({ checkFailed: true });
        }
      });
    }
  }
  
  checkEmail(): void {
    const emailControl = this.registerForm.get('email');
    if (emailControl?.valid) {
      this.authService.checkEmailAvailability(emailControl.value).subscribe({
        next: (response: { available: boolean }) => {
          this.emailChecked = true;
          this.emailAvailable = response.available;
          if (!response.available) {
            emailControl.setErrors({ notAvailable: true });
          } else {
            emailControl.setErrors(null);
          }
        },
        error: () => {
          this.emailChecked = true;
          this.emailAvailable = false;
          emailControl?.setErrors({ checkFailed: true });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = null;
      
      const registerData: RegisterData = this.registerForm.value;
      this.authService.register(registerData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}