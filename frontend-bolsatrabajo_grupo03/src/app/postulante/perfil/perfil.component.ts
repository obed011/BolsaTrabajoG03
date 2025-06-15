import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostulanteService, Postulante } from '../../services/postulante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  datosForm: FormGroup;
  loading = false;
  currentPostulante?: Postulante;

  constructor(
    private fb: FormBuilder,
    private postulanteService: PostulanteService
  ) {
    this.datosForm = this.createForm();
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.setupNacionalidadWatcher();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      telCelular: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{4}$|^[0-9]{8}$')]],
      telFijo: ['', [Validators.pattern('^[0-9]{4}-[0-9]{4}$|^[0-9]{8}$')]],
      fechaNacimiento: [''],
      genero: ['', Validators.required],
      esNacional: [true, Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      dui: ['', [Validators.required, Validators.pattern('^[0-9]{8}-[0-9]$')]],
      pasaporte: [''],
      nit: ['', [Validators.pattern('^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]$')]],
      nup: ['', [Validators.pattern('^[0-9]{12}$')]],
      linkGithub: ['', [Validators.pattern('^https?://github\\.com/.+')]],
      linkLinkedin: ['', [Validators.pattern('^https?://(www\\.)?linkedin\\.com/in/.+')]]
    });
  }

  private setupNacionalidadWatcher(): void {
    this.datosForm.get('esNacional')?.valueChanges.subscribe(value => {
      const duiControl = this.datosForm.get('dui');
      const pasaporteControl = this.datosForm.get('pasaporte');
      
      if (value === true || value === 'true') {
        // Es nacional - DUI requerido, pasaporte opcional
        duiControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{8}-[0-9]$')]);
        pasaporteControl?.clearValidators();
        pasaporteControl?.setValue('');
      } else {
        // Es extranjero - Pasaporte requerido, DUI opcional
        duiControl?.clearValidators();
        duiControl?.setValue('');
        pasaporteControl?.setValidators([Validators.required, Validators.minLength(6)]);
      }
      
      duiControl?.updateValueAndValidity();
      pasaporteControl?.updateValueAndValidity();
    });
  }

  cargarDatos(): void {
    this.loading = true;
    this.postulanteService.getPerfil().subscribe({
      next: (postulante) => {
        this.currentPostulante = postulante;
        this.datosForm.patchValue({
          nombres: postulante.nombres || '',
          apellidos: postulante.apellidos || '',
          telCelular: postulante.telCelular || '',
          telFijo: postulante.telFijo || '',
          fechaNacimiento: postulante.fechaNacimiento || '',
          genero: postulante.genero || '',
          esNacional: postulante.esNacional !== undefined ? postulante.esNacional : true,
          direccion: postulante.direccion || '',
          dui: postulante.dui || '',
          pasaporte: postulante.pasaporte || '',
          nit: postulante.nit || '',
          nup: postulante.nup || '',
          linkGithub: postulante.linkGithub || '',
          linkLinkedin: postulante.linkLinkedin || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del perfil',
          confirmButtonColor: '#3085d6'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.datosForm.valid) {
      this.loading = true;
      const formData = { ...this.datosForm.value };
      
      // Convertir el valor de esNacional a boolean
      formData.esNacional = formData.esNacional === 'true' || formData.esNacional === true;

      // Remover campos vacíos opcionales para evitar errores
      if (!formData.telFijo) delete formData.telFijo;
      if (!formData.fechaNacimiento) delete formData.fechaNacimiento;
      if (!formData.nit) delete formData.nit;
      if (!formData.nup) delete formData.nup;
      if (!formData.linkGithub) delete formData.linkGithub;
      if (!formData.linkLinkedin) delete formData.linkLinkedin;
      
      // Limpiar campos según nacionalidad
      if (formData.esNacional) {
        delete formData.pasaporte;
      } else {
        delete formData.dui;
      }

      this.postulanteService.actualizarPerfil(formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Datos actualizados correctamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          this.cargarDatos(); // Recargar datos actualizados
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          let errorMessage = 'No se pudieron actualizar los datos. Inténtalo de nuevo.';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#3085d6'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos requeridos correctamente',
        confirmButtonColor: '#f39c12'
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.datosForm.controls).forEach(key => {
      const control = this.datosForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Métodos de utilidad para validaciones en el template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.datosForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.datosForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return `Formato de ${fieldName} inválido`;
    }
    return '';
  }

  // Método para verificar si es nacional
  get esNacional(): boolean {
    const value = this.datosForm.get('esNacional')?.value;
    return value === true || value === 'true';
  }

  // Método para resetear el formulario con confirmación
  resetForm(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se perderán todos los cambios no guardados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restablecer',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.datosForm.reset();
        this.cargarDatos();
        Swal.fire({
          icon: 'info',
          title: 'Restablecido',
          text: 'El formulario ha sido restablecido',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
}