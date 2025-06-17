import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.checkAuthenticationStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private checkAuthenticationStatus(): void {
    if (this.authService.isAuthenticated()) {
      this.redirectToUserDashboard();
    }
  }

  private redirectToUserDashboard(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.redirectByRole(user.rol);
    } else {
      // Si hay token pero no datos de usuario, algo está mal - limpiar sesión
      console.warn('Token válido pero sin datos de usuario. Limpiando sesión...');
      this.authService.logout()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.errorMessage = 'Sesión inválida. Por favor, inicia sesión nuevamente.';
          },
          error: (error) => {
            console.error('Error al hacer logout:', error);
            // Limpiar sesión manualmente si el logout falla
            this.authService['clearSession'](); // Acceso al método privado
            this.errorMessage = 'Sesión inválida. Por favor, inicia sesión nuevamente.';
          }
        });
    }
  }

  private redirectByRole(role: string): void {
    const routes: { [key: string]: string } = {
      'POSTULANTE': '/postulante',
      'EMPRESA': '/empresa',
      'ADMIN': '/admin'
    };

    const route = routes[role];

    if (route) {
      this.router.navigate([route]);
    } else {
      // Manejo más estricto para roles inválidos
      console.error(`Rol inválido: ${role}`);
      this.authService.forceLogout();
      this.errorMessage = 'Rol de usuario inválido. Inicia sesión nuevamente.';
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.performLogin();
    } else {
      this.markFormGroupTouched();
    }
  }

  private performLogin(): void {
    this.loading = true;
    this.errorMessage = '';

    const loginData: LoginRequest = {
      correo: this.loginForm.get('correo')?.value?.trim(),
      contrasena: this.loginForm.get('contrasena')?.value
    };

    this.authService.login(loginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleLoginSuccess(response),
        error: (error) => this.handleLoginError(error)
      });
  }

  private handleLoginSuccess(response: any): void {
    this.loading = false;
    if (response.success) {
      console.log('Login exitoso:', response.data);

      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        this.redirectToUserDashboard();
      }, 100);
    } else {
      this.errorMessage = response.message || 'Error en el login';
    }
  }

  private handleLoginError(error: any): void {
    this.loading = false;
    console.error('Error en login:', error);

    if (error.status === 401) {
      if (error.error && error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
      }
    } else if (error.status === 0) {
      this.errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
    } else if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'Error inesperado. Inténtalo de nuevo.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para facilitar el acceso a los controles del formulario
  get correo() { return this.loginForm.get('correo'); }
  get contrasena() { return this.loginForm.get('contrasena'); }

  // Métodos para mostrar errores
  getEmailError(): string {
    if (this.correo?.hasError('required') && this.correo?.touched) {
      return 'El correo es obligatorio';
    }
    if (this.correo?.hasError('email') && this.correo?.touched) {
      return 'El correo debe tener un formato válido';
    }
    return '';
  }

  getPasswordError(): string {
    if (this.contrasena?.hasError('required') && this.contrasena?.touched) {
      return 'La contraseña es obligatoria';
    }
    if (this.contrasena?.hasError('minlength') && this.contrasena?.touched) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  // Método para limpiar errores cuando el usuario empiece a escribir
  clearError(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}