import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OfertasService, Oferta, CategoriaOferta, CategoriaPuesto, CategoriaHabilidad, HabilidadTecnica, NivelAcademico, Especialidad, RequerimientoExperiencia } from '../../../services/ofertas.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-ofertas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './formulario-ofertas.component.html',
  styleUrl: './formulario-ofertas.component.css'
})
export class FormularioOfertasComponent implements OnInit {
  ofertaForm!: FormGroup;

  // Catálogos
  categoriasOfertas: CategoriaOferta[] = [];
  categoriasPuestos: CategoriaPuesto[] = [];
  categoriasHabilidades: CategoriaHabilidad[] = [];
  habilidadesTecnicas: HabilidadTecnica[] = [];
  nivelesAcademicos: NivelAcademico[] = [];
  especialidades: Especialidad[] = [];

  // Estados
  loading = false;
  loadingHabilidades = false;
  loadingEspecialidades = false;
  isEditMode = false;
  ofertaId: number | null = null;
  empresaId: number | null = null;
  ofertaActual: Oferta | null = null;

  // Tab activo
  activeTab = 'basica';

  // Modalidades predefinidas
  modalidadesTrabajo = [
    { value: 'Presencial', label: 'Presencial' },
    { value: 'Remoto', label: 'Remoto' },
    { value: 'Híbrido', label: 'Híbrido' }
  ];

  // Años de experiencia
  anosExperiencia = [
    { value: 0, label: 'Sin experiencia' },
    { value: 1, label: '1 año' },
    { value: 2, label: '2 años' },
    { value: 3, label: '3 años' },
    { value: 4, label: '4 años' },
    { value: 5, label: '5 años' },
    { value: 6, label: '6-10 años' },
    { value: 10, label: 'Más de 10 años' }
  ];

  // Nuevas propiedades para manejo de tablas
  experienciasAgregadas: RequerimientoExperiencia[] = [];
  habilidadesAgregadas: any[] = []; // Con nombres incluidos
  especialidadesAgregadas: any[] = []; // Con nombres incluidos

  // Objetos para nuevos elementos
  nuevaExperiencia = {
    puestoRq: '',
    idCategoriaPuesto: '',
    anosExp: ''
  };

  nuevaHabilidad = {
    idCategoriaHab: '',
    idHabilidad: ''
  };

  nuevaEspecialidad = {
    idNivelAcademico: '',
    idEspecialidad: ''
  };

  constructor(
    private fb: FormBuilder,
    private ofertasService: OfertasService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkEditMode();
    this.getEmpresaId();
    this.initializeForm();
    this.loadCatalogos();

    if (this.isEditMode && this.ofertaId && this.empresaId) {
      this.loadOfertaData();
    }
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.ofertaId = Number(id);
    }
  }

  private getEmpresaId(): void {
    const empresa = this.authService.getCurrentUser()?.empresa;
    if (empresa?.idEmpresa) {
      this.empresaId = empresa.idEmpresa;
    } else {
      console.error('No se encontró información de la empresa');
      this.router.navigate(['/empresa/ofertas']);
    }
  }

  private initializeForm(): void {
    this.ofertaForm = this.fb.group({
      // Información básica
      tituloOferta: ['', [Validators.required, Validators.maxLength(200)]],
      idCategoriaOferta: ['', Validators.required],
      descripcionOferta: ['', [Validators.required, Validators.maxLength(1000)]],
      modalidad: ['', Validators.required],
      ubicacion: ['', [Validators.required, Validators.maxLength(100)]],
      salario: ['', [Validators.required, Validators.min(0)]],
      fechaExpiracion: ['', Validators.required]
    });
  }

  private loadCatalogos(): void {
    // Cargar todas las categorías al inicializar
    this.ofertasService.getCategoriasOfertas().subscribe({
      next: (data) => this.categoriasOfertas = data,
      error: (err) => console.error('Error cargando categorías ofertas:', err)
    });

    this.ofertasService.getCategoriasPuestos().subscribe({
      next: (data) => this.categoriasPuestos = data,
      error: (err) => console.error('Error cargando categorías puestos:', err)
    });

    this.ofertasService.getCategoriasHabilidades().subscribe({
      next: (data) => this.categoriasHabilidades = data,
      error: (err) => console.error('Error cargando categorías habilidades:', err)
    });

    this.ofertasService.getNivelesAcademicos().subscribe({
      next: (data) => this.nivelesAcademicos = data,
      error: (err) => console.error('Error cargando niveles académicos:', err)
    });
  }

  private loadOfertaData(): void {
    if (!this.empresaId || !this.ofertaId) return;

    this.loading = true;
    this.ofertasService.getOferta(this.empresaId, this.ofertaId).subscribe({
      next: (oferta) => {
        this.ofertaActual = oferta;
        this.populateForm(oferta);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar oferta:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información de la oferta',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/empresa/ofertas']);
        });
      }
    });
  }

  private populateForm(oferta: Oferta): void {
    // Llenar información básica
    this.ofertaForm.patchValue({
      tituloOferta: oferta.tituloOferta,
      idCategoriaOferta: oferta.idCategoriaOferta,
      descripcionOferta: oferta.descripcionOferta,
      modalidad: oferta.modalidad,
      ubicacion: oferta.ubicacion,
      salario: oferta.salario,
      fechaExpiracion: this.formatDateForInput(oferta.fechaExpiracion)
    });

    // Cargar experiencias
    if (oferta.requerimientosExperiencia && oferta.requerimientosExperiencia.length > 0) {
      this.experienciasAgregadas = [];
      this.experienciasAgregadas = [...oferta.requerimientosExperiencia];
    } else {
      this.experienciasAgregadas = [];
    }


    // Cargar habilidades con nombres
    if (oferta.habilidadesRequeridas && oferta.habilidadesRequeridas.length > 0) {
      this.ofertasService.getHabilidadesPorIds(oferta.habilidadesRequeridas).subscribe({
        next: (habilidades) => {
          this.habilidadesAgregadas = habilidades;
        },
        error: (err) => console.error('Error cargando nombres de habilidades:', err)
      });
    }

    // Cargar especialidades con nombres
    if (oferta.especialidadesRequeridas && oferta.especialidadesRequeridas.length > 0) {
      this.ofertasService.getEspecialidadesPorIds(oferta.especialidadesRequeridas).subscribe({
        next: (especialidades) => {
          this.especialidadesAgregadas = especialidades;
        },
        error: (err) => console.error('Error cargando nombres de especialidades:', err)
      });
    }
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  private clearFormArray(arrayName: string): void {
    const formArray = this.ofertaForm.get(arrayName) as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  // Cargar habilidades por categoría
  loadHabilidadesPorCategoria(categoriaId: number, index: number): void {
    this.loadingHabilidades = true;
    this.ofertasService.getHabilidadesPorCategoria(categoriaId).subscribe({
      next: (habilidades) => {
        // Aquí podrías almacenar las habilidades específicas para este índice
        // Por simplicidad, las almaceno en una propiedad general
        this.habilidadesTecnicas = habilidades;
        this.loadingHabilidades = false;
      },
      error: (err) => {
        console.error('Error cargando habilidades:', err);
        this.loadingHabilidades = false;
      }
    });
  }

  // Cargar especialidades por nivel
  loadEspecialidadesPorNivel(nivelId: number, index: number): void {
    this.loadingEspecialidades = true;
    this.ofertasService.getEspecialidadesPorNivel(nivelId).subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
        this.loadingEspecialidades = false;
      },
      error: (err) => {
        console.error('Error cargando especialidades:', err);
        this.loadingEspecialidades = false;
      }
    });
  }

  // Navegación entre tabs
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  nextTab(): void {
    if (this.activeTab === 'basica') {
      this.setActiveTab('requisitos');
    }
  }

  previousTab(): void {
    if (this.activeTab === 'requisitos') {
      this.setActiveTab('basica');
    }
  }

  // Validación del formulario
  private validateBasicInfo(): boolean {
    const basicFields = ['tituloOferta', 'idCategoriaOferta', 'descripcionOferta', 'modalidad', 'ubicacion', 'salario', 'fechaExpiracion'];
    return basicFields.every(field => this.ofertaForm.get(field)?.valid);
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.ofertaForm.valid && this.empresaId) {
      this.loading = true;

      const formData = this.prepareFormData();

      if (this.isEditMode && this.ofertaId) {
        this.updateOferta(formData);
      } else {
        this.createOferta(formData);
      }
    } else {
      this.markFormGroupTouched();
      this.setActiveTab('basica'); // Ir al primer tab si hay errores
    }
  }

  private prepareFormData(): any {
    const formValue = this.ofertaForm.value;

    return {
      idEmpresa: this.empresaId,
      idCategoriaOferta: Number(formValue.idCategoriaOferta),
      tituloOferta: formValue.tituloOferta,
      descripcionOferta: formValue.descripcionOferta,
      salario: Number(formValue.salario),
      ubicacion: formValue.ubicacion,
      modalidad: formValue.modalidad,
      fechaExpiracion: formValue.fechaExpiracion,

      replaceExisting: this.isEditMode, // Indica al backend que reemplace

      requerimientosExperiencia: this.experienciasAgregadas,
      habilidadesRequeridas: this.habilidadesAgregadas.map(hab => hab.idHabilidad),
      especialidadesRequeridas: this.especialidadesAgregadas.map(esp => esp.idEspecialidad)
    };
  }

  private createOferta(data: any): void {
    this.ofertasService.crearOferta(this.empresaId!, data).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          title: '¡Publicada!',
          text: 'La oferta laboral se ha publicado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/empresa/ofertas']);
        });
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err, 'No se pudo publicar la oferta');
      }
    });
  }

  private updateOferta(data: any): void {
    this.ofertasService.actualizarOferta(this.empresaId!, this.ofertaId!, data).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          title: '¡Actualizada!',
          text: 'La oferta laboral se ha actualizado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/empresa/ofertas']);
        });
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err, 'No se pudo actualizar la oferta');
      }
    });
  }

  private handleError(err: any, defaultMessage: string): void {
    console.error('Error:', err);
    let mensaje = defaultMessage;

    if (err.status === 400 && err.error?.error) {
      mensaje = err.error.error;
    } else if (err.error?.message) {
      mensaje = err.error.message;
    } else if (err.status === 404) {
      mensaje = 'Recurso no encontrado';
    } else if (err.status === 403) {
      mensaje = 'No tienes permisos para realizar esta acción';
    }

    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ofertaForm.controls).forEach(key => {
      const control = this.ofertaForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          Object.keys((group as FormGroup).controls).forEach(subKey => {
            (group as FormGroup).get(subKey)?.markAsTouched();
          });
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Métodos helper para el template
  getFieldError(fieldName: string): string {
    const field = this.ofertaForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} es demasiado largo`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} debe ser mayor a 0`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'tituloOferta': 'El título de la oferta',
      'idCategoriaOferta': 'La categoría de la oferta',
      'descripcionOferta': 'La descripción',
      'modalidad': 'La modalidad de trabajo',
      'ubicacion': 'La ubicación',
      'salario': 'El salario',
      'fechaExpiracion': 'La fecha de expiración'
    };
    return fieldNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ofertaForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  onCancel(): void {
    this.router.navigate(['/empresa/ofertas']);
  }

  // Getters para el template
  get pageTitle(): string {
    return this.isEditMode ? 'Editar Oferta Laboral' : 'Nueva Oferta Laboral';
  }

  get pageSubtitle(): string {
    return this.isEditMode ? 'Modifica los datos de tu oferta laboral' : 'Crea y publica una nueva oferta de trabajo';
  }

  get submitButtonText(): string {
    if (this.loading) {
      return this.isEditMode ? 'Actualizando...' : 'Publicando...';
    }
    return this.isEditMode ? 'Actualizar Oferta' : 'Publicar Oferta';
  }

  get canGoToNextTab(): boolean {
    return this.validateBasicInfo();
  }

  // Métodos para manejar experiencias - CORREGIDOS
  isExperienciaValida(): boolean {
    return !!(this.nuevaExperiencia.puestoRq.trim() &&
      this.nuevaExperiencia.idCategoriaPuesto &&
      this.nuevaExperiencia.anosExp !== '');
  }

  agregarExperiencia(): void {
    if (this.isExperienciaValida()) {
      const experiencia: RequerimientoExperiencia = {
        puestoRq: this.nuevaExperiencia.puestoRq.trim(),
        idCategoriaPuesto: Number(this.nuevaExperiencia.idCategoriaPuesto),
        anosExp: Number(this.nuevaExperiencia.anosExp)
      };

      // Verificar que no esté duplicada
      const yaExiste = this.experienciasAgregadas.some(exp =>
        exp.puestoRq.toLowerCase() === experiencia.puestoRq.toLowerCase() &&
        exp.idCategoriaPuesto === experiencia.idCategoriaPuesto
      );

      if (!yaExiste) {
        this.experienciasAgregadas.push(experiencia);
        this.limpiarNuevaExperiencia();
      } else {
        Swal.fire({
          title: 'Duplicado',
          text: 'Esta experiencia ya ha sido agregada',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  }

  eliminarExperiencia(index: number): void {
    if (index >= 0 && index < this.experienciasAgregadas.length) {
      this.experienciasAgregadas.splice(index, 1);
    }
  }

  private limpiarNuevaExperiencia(): void {
    this.nuevaExperiencia = {
      puestoRq: '',
      idCategoriaPuesto: '',
      anosExp: ''
    };
  }

  // Métodos para manejar habilidades - CORREGIDOS
  isHabilidadValida(): boolean {
    return !!(this.nuevaHabilidad.idCategoriaHab &&
      this.nuevaHabilidad.idHabilidad &&
      this.habilidadesTecnicas.length > 0);
  }

  onCategoriaHabilidadChange(event: any): void {
    const categoriaId = event.target.value;
    this.nuevaHabilidad.idHabilidad = '';

    if (categoriaId) {
      this.loadHabilidadesPorCategoria(Number(categoriaId), -1);
    } else {
      this.habilidadesTecnicas = [];
    }
  }

  agregarHabilidad(): void {
    if (this.isHabilidadValida()) {
      const habilidadSeleccionada = this.habilidadesTecnicas.find(h =>
        h.idHabilidad === Number(this.nuevaHabilidad.idHabilidad)
      );

      if (habilidadSeleccionada) {
        // Verificar que no esté duplicada
        const yaExiste = this.habilidadesAgregadas.some(hab =>
          hab.idHabilidad === habilidadSeleccionada.idHabilidad
        );

        if (!yaExiste) {
          this.habilidadesAgregadas.push({ ...habilidadSeleccionada });
          this.limpiarNuevaHabilidad();
        } else {
          Swal.fire({
            title: 'Duplicado',
            text: 'Esta habilidad ya ha sido agregada',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    }
  }

  eliminarHabilidad(index: number): void {
    if (index >= 0 && index < this.habilidadesAgregadas.length) {
      this.habilidadesAgregadas.splice(index, 1);
    }
  }

  private limpiarNuevaHabilidad(): void {
    this.nuevaHabilidad = {
      idCategoriaHab: '',
      idHabilidad: ''
    };
    this.habilidadesTecnicas = [];
  }

  // Métodos para manejar especialidades - CORREGIDOS
  isEspecialidadValida(): boolean {
    return !!(this.nuevaEspecialidad.idNivelAcademico &&
      this.nuevaEspecialidad.idEspecialidad &&
      this.especialidades.length > 0);
  }

  onNivelAcademicoChange(event: any): void {
    const nivelId = event.target.value;
    this.nuevaEspecialidad.idEspecialidad = '';

    if (nivelId) {
      this.loadEspecialidadesPorNivel(Number(nivelId), -1);
    } else {
      this.especialidades = [];
    }
  }

  agregarEspecialidad(): void {
    if (this.isEspecialidadValida()) {
      const especialidadSeleccionada = this.especialidades.find(e =>
        e.idEspecialidad === Number(this.nuevaEspecialidad.idEspecialidad)
      );

      if (especialidadSeleccionada) {
        // Verificar que no esté duplicada
        const yaExiste = this.especialidadesAgregadas.some(esp =>
          esp.idEspecialidad === especialidadSeleccionada.idEspecialidad
        );

        if (!yaExiste) {
          // Agregar el idNivelAcademico al objeto
          const especialidadConNivel = {
            ...especialidadSeleccionada,
            idNivelAcademico: Number(this.nuevaEspecialidad.idNivelAcademico)
          };
          this.especialidadesAgregadas.push(especialidadConNivel);
          this.limpiarNuevaEspecialidad();
        } else {
          Swal.fire({
            title: 'Duplicado',
            text: 'Esta especialidad ya ha sido agregada',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    }
  }

  eliminarEspecialidad(index: number): void {
    if (index >= 0 && index < this.especialidadesAgregadas.length) {
      this.especialidadesAgregadas.splice(index, 1);
    }
  }

  private limpiarNuevaEspecialidad(): void {
    this.nuevaEspecialidad = {
      idNivelAcademico: '',
      idEspecialidad: ''
    };
    this.especialidades = [];
  }

  // Métodos helper para mostrar nombres
  getNombreCategoriaPuesto(id: number): string {
    const categoria = this.categoriasPuestos.find(c => c.idPuesto === id);
    return categoria ? categoria.nombreCategoria : 'N/A';
  }

  getLabelAnosExperiencia(anos: number): string {
    const anosObj = this.anosExperiencia.find(a => a.value === anos);
    return anosObj ? anosObj.label : `${anos} años`;
  }

  getNombreNivelAcademico(id: number): string {
    const nivel = this.nivelesAcademicos.find(n => n.idNivAcademico === id);
    return nivel ? nivel.nomNivel : 'N/A';
  }

  // Validación mejorada del formulario completo
  public isFormValid(): boolean {
    const basicValid = this.ofertaForm.valid;

    // Solo validar que tenga al menos una de cada requisito en modo creación
    // En modo edición, pueden estar vacíos si originalmente no tenían
    if (!this.isEditMode) {
      const hasExperiencia = this.experienciasAgregadas.length > 0;
      const hasHabilidades = this.habilidadesAgregadas.length > 0;
      const hasEspecialidades = this.especialidadesAgregadas.length > 0;

      return basicValid && hasExperiencia && hasHabilidades && hasEspecialidades;
    }

    // En modo edición, solo validar que la información básica esté correcta
    return basicValid;
  }
}