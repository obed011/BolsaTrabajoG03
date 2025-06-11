import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExperienciaLaboralService, ExperienciaLaboral } from '../../../services/experiencia-laboral.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-experiencia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './formulario-experiencia.component.html',
  styleUrl: './formulario-experiencia.component.css'
})
export class FormularioExperienciaComponent implements OnInit {
  experienciaForm!: FormGroup;
  categorias: any[] = [];
  loading = false;
  mostrarCheckboxTrabajoActual = true;
  isEditMode = false;
  experienciaId: number | null = null;
  experienciaActual: ExperienciaLaboral | null = null;

  constructor(
    private fb: FormBuilder,
    private experienciaService: ExperienciaLaboralService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkEditMode();
    this.initializeForm();
    this.loadCategorias();

    if (this.isEditMode && this.experienciaId) {
      this.loadExperienciaData();
    } else {
      this.verificarTrabajoActual();
    }
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.experienciaId = Number(id);
    }
  }

  private initializeForm(): void {
    const postulante = this.authService.getCurrentUser()?.postulante;

    this.experienciaForm = this.fb.group({
      nomOrganizacion: ['', [Validators.required, Validators.minLength(2)]],
      nomPuesto: ['', [Validators.required, Validators.minLength(2)]],
      funciones: ['', [Validators.required, Validators.minLength(10)]],
      contactoOrganizacion: [''],
      inicioExp: ['', Validators.required],
      finExp: [''],
      trabajoActual: [false],
      idPuesto: ['', Validators.required],
      idPostulante: [postulante?.idPostulante || 0, Validators.required]
    });

    // Escuchar cambios en el checkbox de trabajo actual
    this.experienciaForm.get('trabajoActual')?.valueChanges.subscribe(isCurrentJob => {
      const finExpControl = this.experienciaForm.get('finExp');
      if (isCurrentJob) {
        finExpControl?.setValue('');
        finExpControl?.disable();
      } else {
        finExpControl?.enable();
      }
    });
  }

  private loadExperienciaData(): void {
    if (!this.experienciaId) return;

    this.loading = true;
    this.experienciaService.getExperiencia(this.experienciaId).subscribe({
      next: (experiencia) => {
        this.experienciaActual = experiencia;
        this.populateForm(experiencia);
        this.verificarTrabajoActualEnEdicion(experiencia);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar experiencia:', err);
        // Redirigir si no se encuentra la experiencia
        this.router.navigate(['/postulante/experiencia-laboral']);
      }
    });
  }

  private populateForm(experiencia: ExperienciaLaboral): void {
    // Formatear fechas para el input de tipo date
    const inicioExp = experiencia.inicioExp ? this.formatDateForInput(experiencia.inicioExp) : '';
    const finExp = experiencia.finExp ? this.formatDateForInput(experiencia.finExp) : '';

    this.experienciaForm.patchValue({
      nomOrganizacion: experiencia.nomOrganizacion,
      nomPuesto: experiencia.nomPuesto,
      funciones: experiencia.funciones,
      contactoOrganizacion: experiencia.contactoOrganizacion || '',
      inicioExp: inicioExp,
      finExp: finExp,
      trabajoActual: experiencia.trabajoActual,
      idPuesto: experiencia.idPuesto,
      idPostulante: experiencia.idPostulante
    });
  }

  private formatDateForInput(dateString: string): string {
    // Asume que la fecha viene en formato ISO o similar
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }

  private loadCategorias(): void {
    this.experienciaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
      }
    });
  }

  private verificarTrabajoActualEnEdicion(experiencia: ExperienciaLaboral): void {
    const postulanteId = experiencia.idPostulante;

    this.experienciaService.getExperienciasPorPostulante(postulanteId).subscribe({
      next: (experiencias) => {
        // Filtrar la experiencia actual para no contarla
        const otrasExperiencias = experiencias.filter(exp => exp.idExperiencia !== experiencia.idExperiencia);
        const yaTieneOtroTrabajoActual = otrasExperiencias.some(exp => exp.trabajoActual === true);

        this.mostrarCheckboxTrabajoActual = !yaTieneOtroTrabajoActual || experiencia.trabajoActual;
      },
      error: (err) => {
        console.error('Error al verificar trabajo actual:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.experienciaForm.valid) {
      this.loading = true;

      // Preparar los datos antes de enviar
      const formData = { ...this.experienciaForm.value };

      // Si es trabajo actual, asegurar que finExp sea null o vacío
      if (formData.trabajoActual) {
        formData.finExp = null;
      }

      // Convertir idPuesto e idPostulante a números
      formData.idPuesto = Number(formData.idPuesto);
      formData.idPostulante = Number(formData.idPostulante);

      if (this.isEditMode && this.experienciaId) {
        // Actualizar experiencia existente
        const experiencia: ExperienciaLaboral = {
          idExperiencia: this.experienciaId,
          ...formData
        };

        this.experienciaService.actualizarExperiencia(this.experienciaId, experiencia).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire({
              title: '¡Actualizado!',
              text: 'La experiencia laboral se ha actualizado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['/postulante/experiencia-laboral']);
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('Error al actualizar experiencia:', err);
          }
        });
      } else {
        // Crear nueva experiencia
        const experiencia: ExperienciaLaboral = {
          idExperiencia: 0,
          ...formData
        };

        this.experienciaService.crearExperiencia(experiencia).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire({
              title: '¡Guardado!',
              text: 'La experiencia laboral se ha guardado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['/postulante/experiencia-laboral']);
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('Error al guardar experiencia:', err);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.experienciaForm.controls).forEach(key => {
      const control = this.experienciaForm.get(key);
      control?.markAsTouched();
    });
  }

  private verificarTrabajoActual(): void {
    const postulanteId = this.experienciaForm.get('idPostulante')?.value;

    if (postulanteId) {
      this.experienciaService.getExperienciasPorPostulante(postulanteId).subscribe({
        next: (experiencias) => {
          const yaTieneTrabajoActual = experiencias.some(exp => exp.trabajoActual === true);
          this.mostrarCheckboxTrabajoActual = !yaTieneTrabajoActual;

          if (!this.mostrarCheckboxTrabajoActual) {
            this.experienciaForm.get('trabajoActual')?.setValue(false);
          }
        },
        error: (err) => {
          console.error('Error al verificar trabajo actual:', err);
        }
      });
    }
  }

  // Métodos helper para mostrar errores en el template
  getFieldError(fieldName: string): string {
    const field = this.experienciaForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'nomOrganizacion': 'El nombre de la organización',
      'nomPuesto': 'El nombre del puesto',
      'funciones': 'La descripción del trabajo',
      'inicioExp': 'La fecha de inicio',
      'idPuesto': 'La categoría del puesto'
    };
    return fieldNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.experienciaForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  onCancel(): void {
    this.router.navigate(['/postulante/experiencia-laboral']);
  }

  // Getter para usar en el template
  get pageTitle(): string {
    return this.isEditMode ? 'Editar Experiencia Laboral' : 'Agregar Experiencia Laboral';
  }

  get pageSubtitle(): string {
    return this.isEditMode ? 'Modifica los datos de tu experiencia profesional' : 'Añade una nueva experiencia a tu historial profesional';
  }

  get submitButtonText(): string {
    if (this.loading) {
      return this.isEditMode ? 'Actualizando...' : 'Guardando...';
    }
    return this.isEditMode ? 'Actualizar Experiencia' : 'Guardar Experiencia';
  }
}