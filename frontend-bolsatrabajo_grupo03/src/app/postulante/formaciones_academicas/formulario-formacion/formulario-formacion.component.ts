import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormacionAcademicaService, FormacionAcademica, NivelAcademico, Especialidad } from '../../../services/formacion-academica.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-formacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './formulario-formacion.component.html',
  styleUrl: './formulario-formacion.component.css'
})
export class FormularioFormacionComponent implements OnInit {
  formacionForm!: FormGroup;
  nivelesAcademicos: NivelAcademico[] = [];
  especialidades: Especialidad[] = [];
  loading = false;
  loadingEspecialidades = false;
  mostrarCheckboxEnCurso = true;
  isEditMode = false;
  formacionId: number | null = null;
  formacionActual: FormacionAcademica | null = null;

  constructor(
    private fb: FormBuilder,
    private formacionService: FormacionAcademicaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkEditMode();
    this.initializeForm();
    this.loadNivelesAcademicos();

    if (this.isEditMode && this.formacionId) {
      this.loadFormacionData();
    } else {
      this.verificarFormacionEnCurso();
    }
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.formacionId = Number(id);
    }
  }

  private initializeForm(): void {
    const postulante = this.authService.getCurrentUser()?.postulante;
    const currentYear = new Date().getFullYear();

    this.formacionForm = this.fb.group({
      nombreInstitucion: ['', [Validators.required, Validators.minLength(2)]],
      inicioFormacion: ['', [Validators.required, Validators.min(1950), Validators.max(currentYear + 10)]],
      finFormacion: ['', [Validators.min(1950), Validators.max(currentYear + 10)]],
      idNivelAcademico: ['', Validators.required],
      idEspecialidad: ['', Validators.required],
      enCurso: [false],
      idPostulante: [postulante?.idPostulante || 0, Validators.required]
    });

    // Escuchar cambios en el checkbox de en curso
    this.formacionForm.get('enCurso')?.valueChanges.subscribe(isInProgress => {
      const finFormacionControl = this.formacionForm.get('finFormacion');
      if (isInProgress) {
        finFormacionControl?.setValue('');
        finFormacionControl?.disable();
      } else {
        finFormacionControl?.enable();
      }
    });

    // Escuchar cambios en el nivel académico para cargar especialidades
    this.formacionForm.get('idNivelAcademico')?.valueChanges.subscribe(nivelId => {
      this.formacionForm.get('idEspecialidad')?.setValue('');
      this.especialidades = [];
      if (nivelId) {
        this.loadEspecialidades(nivelId);
      }
    });
  }

  private loadFormacionData(): void {
    if (!this.formacionId) return;

    this.loading = true;
    this.formacionService.getFormacion(this.formacionId).subscribe({
      next: (formacion) => {
        this.formacionActual = formacion;
        // Cargar especialidades del nivel antes de poblar el formulario
        if (formacion.idNivelAcademico) {
          this.loadEspecialidades(formacion.idNivelAcademico, () => {
            this.populateForm(formacion);
            this.verificarFormacionEnCursoEnEdicion(formacion);
            this.loading = false;
          });
        } else {
          this.populateForm(formacion);
          this.verificarFormacionEnCursoEnEdicion(formacion);
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar formación:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información de la formación',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/postulante/educacion']);
        });
      }
    });
  }

  private populateForm(formacion: FormacionAcademica): void {
    this.formacionForm.patchValue({
      nombreInstitucion: formacion.nombreInstitucion,
      inicioFormacion: formacion.inicioFormacion,
      finFormacion: formacion.finFormacion || '',
      idNivelAcademico: formacion.idNivelAcademico,
      idEspecialidad: formacion.idEspecialidad,
      enCurso: formacion.enCurso,
      idPostulante: formacion.idPostulante
    });
  }

  private loadNivelesAcademicos(): void {
    this.formacionService.getNivelesAcademicos().subscribe({
      next: (data) => {
        this.nivelesAcademicos = data;
      },
      error: (err) => {
        console.error('Error al obtener niveles académicos:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los niveles académicos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  private loadEspecialidades(nivelId: number, callback?: () => void): void {
    this.loadingEspecialidades = true;
    this.formacionService.getEspecialidadesPorNivel(nivelId).subscribe({
      next: (data) => {
        this.especialidades = data;
        this.loadingEspecialidades = false;
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error al obtener especialidades:', err);
        this.loadingEspecialidades = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las especialidades',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  private verificarFormacionEnCursoEnEdicion(formacion: FormacionAcademica): void {
    const postulanteId = formacion.idPostulante;

    this.formacionService.getFormacionesPorPostulante(postulanteId).subscribe({
      next: (formaciones) => {
        // Filtrar la formación actual para no contarla
        const otrasFormaciones = formaciones.filter(form => form.idFormacion !== formacion.idFormacion);
        const yaTieneOtraFormacionEnCurso = otrasFormaciones.some(form => form.enCurso === true);

        this.mostrarCheckboxEnCurso = !yaTieneOtraFormacionEnCurso || formacion.enCurso;
      },
      error: (err) => {
        console.error('Error al verificar formación en curso:', err);
      }
    });
  }

  private verificarFormacionEnCurso(): void {
    const postulanteId = this.formacionForm.get('idPostulante')?.value;

    if (postulanteId) {
      this.formacionService.getFormacionesPorPostulante(postulanteId).subscribe({
        next: (formaciones) => {
          const yaTieneFormacionEnCurso = formaciones.some(form => form.enCurso === true);
          this.mostrarCheckboxEnCurso = !yaTieneFormacionEnCurso;

          if (!this.mostrarCheckboxEnCurso) {
            this.formacionForm.get('enCurso')?.setValue(false);
          }
        },
        error: (err) => {
          console.error('Error al verificar formación en curso:', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.formacionForm.valid) {
      this.loading = true;

      // Preparar los datos antes de enviar
      const formData = { ...this.formacionForm.value };

      // Si está en curso, asegurar que finFormacion sea null
      if (formData.enCurso) {
        formData.finFormacion = null;
      }

      // Convertir los IDs a números
      formData.idNivelAcademico = Number(formData.idNivelAcademico);
      formData.idEspecialidad = Number(formData.idEspecialidad);
      formData.idPostulante = Number(formData.idPostulante);
      formData.inicioFormacion = Number(formData.inicioFormacion);
      if (formData.finFormacion) {
        formData.finFormacion = Number(formData.finFormacion);
      }

      if (this.isEditMode && this.formacionId) {
        // Actualizar formación existente
        const formacion: FormacionAcademica = {
          idFormacion: this.formacionId,
          ...formData
        };

        this.formacionService.actualizarFormacion(this.formacionId, formacion).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire({
              title: '¡Actualizado!',
              text: 'La formación académica se ha actualizado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['/postulante/educacion']);
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('Error al actualizar formación:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar la formación académica',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      } else {
        // Crear nueva formación
        const formacion: FormacionAcademica = {
          ...formData
        };

        this.formacionService.crearFormacion(formacion).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire({
              title: '¡Guardado!',
              text: 'La formación académica se ha guardado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['/postulante/educacion']);
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('Error al guardar formación:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo guardar la formación académica',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formacionForm.controls).forEach(key => {
      const control = this.formacionForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos helper para mostrar errores en el template
  getFieldError(fieldName: string): string {
    const field = this.formacionForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} debe ser menor a ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'nombreInstitucion': 'El nombre de la institución',
      'inicioFormacion': 'El año de inicio',
      'finFormacion': 'El año de fin',
      'idNivAcademico': 'El nivel académico',
      'idEspecialidad': 'La especialidad'
    };
    return fieldNames[fieldName] || fieldName;
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.formacionForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  onCancel(): void {
    this.router.navigate(['/postulante/educacion']);
  }

  // Getters para usar en el template
  get pageTitle(): string {
    return this.isEditMode ? 'Editar Formación Académica' : 'Agregar Formación Académica';
  }

  get pageSubtitle(): string {
    return this.isEditMode ? 'Modifica los datos de tu formación educativa' : 'Añade una nueva formación a tu historial académico';
  }

  get submitButtonText(): string {
    if (this.loading) {
      return this.isEditMode ? 'Actualizando...' : 'Guardando...';
    }
    return this.isEditMode ? 'Actualizar Formación' : 'Guardar Formación';
  }
  get maxYear(): number {
    return new Date().getFullYear() + 10;
  }
}
