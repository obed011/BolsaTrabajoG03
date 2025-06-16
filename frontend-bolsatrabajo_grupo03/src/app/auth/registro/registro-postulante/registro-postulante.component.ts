import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterPostulanteRequest } from '../../../services/auth.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-registro-postulante',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    RouterModule
  ],
  templateUrl: './registro-postulante.component.html',
  styleUrl: './registro-postulante.component.css'
})
export class RegistroPostulanteComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/postulante']); 
    }

    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, this.dateValidator]],
      genero: ['', [Validators.required]],
      telefono: ['', [Validators.pattern(/^[0-9]{8}$/)]],
      direccion: [''],
      terminos: [false, [Validators.requiredTrue]],
      notificaciones: [false]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para fechas
  dateValidator(control: AbstractControl) {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const now = new Date();
    const minAge = new Date();
    minAge.setFullYear(now.getFullYear() - 16); // Mínimo 16 años
    
    if (selectedDate > minAge) {
      return { minAge: true };
    }
    
    return null;
  }

  // Validador para confirmar contraseña
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('contrasena');
    const confirmPassword = form.get('confirmarContrasena');
    
    if (!password || !confirmPassword) return null;
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.registerForm.value;
      const registerData: RegisterPostulanteRequest = {
        correo: formValue.correo,
        contrasena: formValue.contrasena,
        nombres: formValue.nombres,
        apellidos: formValue.apellidos,
        telefono: formValue.telefono || undefined,
        fechaNacimiento: formValue.fechaNacimiento || undefined,
        direccion: formValue.direccion || undefined,
        genero: formValue.genero || undefined
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Registro exitoso. Redirigiendo...';
            console.log('Registro exitoso:', response.data);
            
            // Redirigir después de un breve delay
            setTimeout(() => {
              this.router.navigate(['/postulante']);
            }, 1500);
          } else {
            this.errorMessage = response.message || 'Error en el registro';
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error en registro:', error);
          
          if (error.error && error.error.data && typeof error.error.data === 'object') {
            // Errores de validación del backend
            const validationErrors = error.error.data;
            const errorMessages = Object.values(validationErrors).join(', ');
            this.errorMessage = errorMessages;
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error de conexión. Inténtalo de nuevo.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para facilitar el acceso a los controles
  get nombres() { return this.registerForm.get('nombres'); }
  get apellidos() { return this.registerForm.get('apellidos'); }
  get correo() { return this.registerForm.get('correo'); }
  get contrasena() { return this.registerForm.get('contrasena'); }
  get confirmarContrasena() { return this.registerForm.get('confirmarContrasena'); }
  get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
  get genero() { return this.registerForm.get('genero'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get terminos() { return this.registerForm.get('terminos'); }

  // Métodos para mostrar errores específicos
  getNombresError(): string {
    if (this.nombres?.hasError('required')) return 'El nombre es obligatorio';
    if (this.nombres?.hasError('minlength')) return 'El nombre debe tener al menos 2 caracteres';
    return '';
  }

  getApellidosError(): string {
    if (this.apellidos?.hasError('required')) return 'Los apellidos son obligatorios';
    if (this.apellidos?.hasError('minlength')) return 'Los apellidos deben tener al menos 2 caracteres';
    return '';
  }

  getEmailError(): string {
    if (this.correo?.hasError('required')) return 'El correo es obligatorio';
    if (this.correo?.hasError('email')) return 'El correo debe tener un formato válido';
    return '';
  }

  getPasswordError(): string {
    if (this.contrasena?.hasError('required')) return 'La contraseña es obligatoria';
    if (this.contrasena?.hasError('minlength')) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }

  getConfirmPasswordError(): string {
    if (this.confirmarContrasena?.hasError('required')) return 'Debes confirmar la contraseña';
    if (this.registerForm.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';
    return '';
  }

  getFechaNacimientoError(): string {
    if (this.fechaNacimiento?.hasError('required')) return 'La fecha de nacimiento es obligatoria';
    if (this.fechaNacimiento?.hasError('minAge')) return 'Debes tener al menos 16 años';
    return '';
  }

  getGeneroError(): string {
    if (this.genero?.hasError('required')) return 'El género es obligatorio';
    return '';
  }

  getTelefonoError(): string {
    if (this.telefono?.hasError('pattern')) return 'El teléfono debe tener 8 dígitos';
    return '';
  }

  getTerminosError(): string {
    if (this.terminos?.hasError('required')) return 'Debes aceptar los términos y condiciones';
    return '';
  }
}
