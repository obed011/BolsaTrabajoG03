import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HabilidadesService, Habilidad, CategoriaHabilidad, HabilidadTecnica } from '../../../services/habilidades.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-habilidades',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './formulario-habilidades.component.html',
  styleUrl: './formulario-habilidades.component.css'
})
export class FormularioHabilidadesComponent implements OnInit {
  habilidadForm!: FormGroup;
  categoriasHabilidades: CategoriaHabilidad[] = [];
  habilidadesTecnicas: HabilidadTecnica[] = [];
  loading = false;
  loadingHabilidades = false;
  isEditMode = false;
  habilidadId: number | null = null;
  habilidadActual: Habilidad | null = null;

  // Niveles de dominio predefinidos
  nivelesHabilidad = [
    { value: 'Básico', label: 'Básico' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' }
  ];

  constructor(
    private fb: FormBuilder,
    private habilidadesService: HabilidadesService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkEditMode();
    this.initializeForm();
    this.loadCategoriasHabilidades();

    if (this.isEditMode && this.habilidadId) {
      this.loadHabilidadData();
    }
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.habilidadId = Number(id);
    }
  }

  private initializeForm(): void {
    const postulante = this.authService.getCurrentUser()?.postulante;

    this.habilidadForm = this.fb.group({
      idCategoriaHab: ['', Validators.required],
      idHabilidadTecnica: ['', Validators.required],
      nivel: ['', Validators.required],
      idPostulante: [postulante?.idPostulante || 0, Validators.required]
    });

    // Escuchar cambios en la categoría para cargar habilidades técnicas
    this.habilidadForm.get('idCategoriaHab')?.valueChanges.subscribe(categoriaId => {
      this.habilidadForm.get('idHabilidadTecnica')?.setValue('');
      this.habilidadesTecnicas = [];
      if (categoriaId) {
        this.loadHabilidadesTecnicas(categoriaId);
      }
    });
  }

  // Reemplaza el método loadHabilidadData en tu componente
  private loadHabilidadData(): void {
    if (!this.habilidadId) return;

    const postulante = this.authService.getCurrentUser()?.postulante;
    if (!postulante?.idPostulante) {
      console.error('No se encontró información del postulante');
      this.router.navigate(['/postulante/habilidades']);
      return;
    }

    this.loading = true;

    // Obtener todas las habilidades del postulante y buscar la específica
    this.habilidadesService.getHabilidadesPorPostulante(postulante.idPostulante).subscribe({
      next: (habilidades) => {
        const habilidadEncontrada = habilidades.find(h => h.idHabilidad === this.habilidadId);

        if (habilidadEncontrada) {
          this.habilidadActual = habilidadEncontrada;

          // Cargar habilidades técnicas de la categoría antes de poblar el formulario
          if (habilidadEncontrada.idCategoriaHab) {
            this.loadHabilidadesTecnicas(habilidadEncontrada.idCategoriaHab, () => {
              this.populateForm(habilidadEncontrada);
              this.loading = false;
            });
          } else {
            this.populateForm(habilidadEncontrada);
            this.loading = false;
          }
        } else {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: 'No se encontró la habilidad especificada',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/postulante/habilidades']);
          });
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar habilidades del postulante:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información de las habilidades',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/postulante/habilidades']);
        });
      }
    });
  }

  private populateForm(habilidad: Habilidad): void {
    this.habilidadForm.patchValue({
      idCategoriaHab: habilidad.idCategoriaHab,
      idHabilidadTecnica: habilidad.idHabilidadTecnica,
      nivel: habilidad.nivel,
      idPostulante: habilidad.idPostulante
    });
  }

  private loadCategoriasHabilidades(): void {
    this.habilidadesService.getCategoriasHabilidades().subscribe({
      next: (data) => {
        this.categoriasHabilidades = data;
      },
      error: (err) => {
        console.error('Error al obtener categorías de habilidades:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las categorías de habilidades',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  private loadHabilidadesTecnicas(categoriaId: number, callback?: () => void): void {
    this.loadingHabilidades = true;
    this.habilidadesService.getHabilidadesPorCategoria(categoriaId).subscribe({
      next: (data) => {
        this.habilidadesTecnicas = data;
        this.loadingHabilidades = false;
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error al obtener habilidades técnicas:', err);
        this.loadingHabilidades = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las habilidades técnicas',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Reemplaza la sección de manejo de errores en el método onSubmit()

  onSubmit(): void {
    if (this.habilidadForm.valid) {
      this.loading = true;

      // Preparar los datos antes de enviar
      const formData = { ...this.habilidadForm.value };

      // Convertir los IDs a números
      formData.idCategoriaHab = Number(formData.idCategoriaHab);
      formData.idHabilidadTecnica = Number(formData.idHabilidadTecnica);
      formData.idPostulante = Number(formData.idPostulante);

      if (this.isEditMode && this.habilidadId) {
        // Actualizar habilidad existente
        const habilidad: Habilidad = {
          idHabilidad: this.habilidadId,
          ...formData
        };

        this.habilidadesService.actualizarHabilidad(this.habilidadId, habilidad).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire({
              title: '¡Actualizado!',
              text: 'La habilidad se ha actualizado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['/postulante/habilidades']);
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('Error al actualizar habilidad:', err);

            // Manejo específico de errores mejorado
            let mensaje = 'No se pudo actualizar la habilidad';

            if (err.status === 400 && err.error?.error) {
              // Error específico del backend para habilidades duplicadas
              mensaje = err.error.error;
            } else if (err.error?.message) {
              mensaje = err.error.message;
            } else if (err.status === 409) {
              mensaje = 'Ya tienes registrada esta habilidad';
            } else if (err.status === 400) {
              mensaje = 'Datos inválidos. Verifica la información ingresada';
            }

            Swal.fire({
              title: 'Error',
              text: mensaje,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      } else {
        // Crear nueva habilidad
        const habilidad: Habilidad = {
          ...formData
        };

        this.habilidadesService.crearHabilidad(habilidad).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire({
              title: '¡Guardado!',
              text: 'La habilidad se ha guardado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['/postulante/habilidades']);
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('Error al guardar habilidad:', err);

            // Manejo específico de errores mejorado
            let mensaje = 'No se pudo guardar la habilidad';

            if (err.status === 400 && err.error?.error) {
              // Error específico del backend para habilidades duplicadas
              mensaje = err.error.error;
            } else if (err.error?.message) {
              mensaje = err.error.message;
            } else if (err.status === 409) {
              mensaje = 'Ya tienes registrada esta habilidad';
            } else if (err.status === 400) {
              mensaje = 'Datos inválidos. Verifica la información ingresada';
            }

            Swal.fire({
              title: 'Error',
              text: mensaje,
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
    Object.keys(this.habilidadForm.controls).forEach(key => {
      const control = this.habilidadForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos helper para mostrar errores en el template
  getFieldError(fieldName: string): string {
    const field = this.habilidadForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'idCategoriaHab': 'La categoría de habilidad',
      'idHabilidadTecnica': 'La habilidad técnica',
      'nivel': 'El nivel de dominio'
    };
    return fieldNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.habilidadForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  onCancel(): void {
    this.router.navigate(['/postulante/habilidades']);
  }

  // Getters para usar en el template
  get pageTitle(): string {
    return this.isEditMode ? 'Editar Habilidad' : 'Agregar Habilidad';
  }

  get pageSubtitle(): string {
    return this.isEditMode ? 'Modifica los datos de tu habilidad' : 'Añade una nueva habilidad a tu perfil';
  }

  get submitButtonText(): string {
    if (this.loading) {
      return this.isEditMode ? 'Actualizando...' : 'Guardando...';
    }
    return this.isEditMode ? 'Actualizar Habilidad' : 'Guardar Habilidad';
  }

  // Método helper para obtener el nombre de la habilidad seleccionada
  get selectedHabilidadName(): string {
    const idHabilidad = this.habilidadForm.get('idHabilidadTecnica')?.value;
    if (idHabilidad) {
      const habilidad = this.habilidadesTecnicas.find(h => h.idHabilidad === Number(idHabilidad));
      return habilidad ? habilidad.nomHabilidad : '';
    }
    return '';
  }
}