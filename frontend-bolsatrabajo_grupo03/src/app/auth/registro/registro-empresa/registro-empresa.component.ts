import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterEmpresaRequest } from '../../../services/auth.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-registro-empresa',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    RouterModule
  ],
  templateUrl: './registro-empresa.component.html',
  styleUrl: './registro-empresa.component.css'
})
export class RegistroEmpresaComponent implements OnInit {
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

  rubros = [
    'Tecnología',
    'Salud',
    'Educación',
    'Finanzas',
    'Turismo',
    'Alimentación',
    'Construcción',
    'Retail',
    'Logística',
    'Otros'
  ];

  ngOnInit(): void {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/empresa']); 
    }

    this.registerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
      nombreEmpresa: ['', [Validators.required, Validators.minLength(2)]],
      nitEmpresa: ['', [Validators.pattern(/^\d{4}-\d{6}-\d{3}-\d$/)]],
      rubroEmpresa: ['', [Validators.required]],
      telefonoEmpresa: ['', [Validators.pattern(/^\d{4}-\d{4}$/)]],
      direccionEmpresa: [''],
      descripcion: [''],
      sitioWeb: ['']
    }, {
      validators: this.passwordMatchValidator
    });
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
    if (this.registerForm.valid){
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.registerForm.value;
      const registerData: RegisterEmpresaRequest = {
        correo: formValue.correo,
        contrasena: formValue.contrasena,
        nombreEmpresa: formValue.nombreEmpresa,
        nitEmpresa: formValue.nitEmpresa || undefined,
        rubroEmpresa: formValue.rubroEmpresa || undefined,
        telefonoEmpresa: formValue.telefonoEmpresa || undefined,
        direccionEmpresa: formValue.direccionEmpresa || undefined,
        descripcion: formValue.descripcion || undefined,
        sitioWeb: formValue.sitioWeb || undefined
      };

      this.authService.registerEmpresa(registerData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Empresa registrada exitosamente. Redirigiendo...';
            
            //redirigir después de un breve retraso
            setTimeout(() => {
              this.router.navigate(['/empresa']);
            }, 2000);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error en el servidor';
          console.error('Error en registro:', error);
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

  //Getters para facilitar el acceso a los controles
  get correo() { return this.registerForm.get('correo'); }
  get contrasena() { return this.registerForm.get('contrasena'); }
  get confirmarContrasena() { return this.registerForm.get('confirmarContrasena'); }
  get nombreEmpresa() { return this.registerForm.get('nombreEmpresa'); }
  get nitEmpresa() { return this.registerForm.get('nitEmpresa'); }
  get rubroEmpresa() { return this.registerForm.get('rubroEmpresa'); }
  get telefonoEmpresa() { return this.registerForm.get('telefonoEmpresa'); }
  get direccionEmpresa() { return this.registerForm.get('direccionEmpresa'); }
  get descripcion() { return this.registerForm.get('descripcion'); }
  get sitioWeb() { return this.registerForm.get('sitioWeb');}

  //Mostrar errores especificos
  getNombreEmpresaError(): string {
    if (this.nombreEmpresa?.hasError('required')) {
      return 'El nombre de la empresa es obligatorio.';
    }
    if (this.nombreEmpresa?.hasError('minlength')) {
      return 'El nombre de la empresa debe tener al menos 2 caracteres.';
    }
    return '';
  }

  getNitEmpresaError(): string {
    if (this.nitEmpresa?.hasError('pattern')) {
      return 'El NIT debe tener el formato XXXX-XXXXXX-XXX-X';
    }
    return '';
  }

  getRubroEmpresaError(): string {
    if (this.rubroEmpresa?.hasError('required')) {
      return 'El rubro de la empresa es obligatorio.';
    }
    return '';
  }

  getTelefonoEmpresaError(): string {
    if (this.telefonoEmpresa?.hasError('pattern')) {
      return 'El teléfono de la empresa debe tener el formato XXXX-XXXX';
    }
    return '';
  }

  getCorreoError(): string {
    if (this.correo?.hasError('required')) return 'El correo es obligatorio';
    if (this.correo?.hasError('email')) return 'El correo debe ser un email válido';
    return '';
  }

  getContrasenaError(): string {
    if (this.contrasena?.hasError('required')) return 'La contraseña es obligatoria';
    if (this.contrasena?.hasError('minlength')) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }

  getConfirmarContrasenaError(): string {
    if (this.confirmarContrasena?.hasError('required')) return 'Debes confirmar la contraseña';
    if (this.registerForm.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';
    return '';
  }

  getDireccionEmpresaError(): string {
    if (this.direccionEmpresa?.hasError('required')) return 'La dirección de la empresa es obligatoria';
    return '';
  }

  getDescripcionError(): string {
    if (this.descripcion?.hasError('required')) return 'La descripción de la empresa es obligatoria';
    return '';
  }

  getSitioWebError(): string {
    if (this.sitioWeb?.hasError('required')) return 'El sitio web de la empresa es obligatorio';
    return '';
  }

}
