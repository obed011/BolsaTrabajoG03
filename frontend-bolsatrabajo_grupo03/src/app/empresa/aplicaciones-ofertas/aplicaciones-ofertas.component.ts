
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AplicacionesService, Aplicacion, AplicacionesResponse } from '../../services/aplicaciones.service';
import { AuthService } from '../../services/auth.service';
import { CurriculumService } from '../../services/curriculum.service';
import Swal from 'sweetalert2';
interface FormacionAcademica {
  institucion: string;
  especialidad: string;
  nivel: string;
  inicio: number;
  fin: number;
}

interface ExperienciaLaboral {
  organizacion: string;
  puesto: string;
  funciones: string;
  inicio: string;
  fin: string | null;
}

interface Habilidad {
  habilidad: string;
  nivel: string;
}

interface CurriculumResponse {
  id_postulante: number;
  nombre_completo: string;
  genero: string;
  telefono: string;
  direccion: string;
  formacion_academica: FormacionAcademica[];
  experiencia_laboral: ExperienciaLaboral[];
  habilidades: Habilidad[];
}

@Component({
  selector: 'app-aplicaciones-ofertas',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './aplicaciones-ofertas.component.html',
  styleUrl: './aplicaciones-ofertas.component.css'
})

export class AplicacionesOfertasComponent implements OnInit {
  aplicaciones: Aplicacion[] = [];
  estadosDisponibles: string[] = [];
  loading = false;
  error: string | null = null;
  curriculum: CurriculumResponse | null = null;
  loadingCurriculum = false;

  // Filtros
  filtroTexto = '';
  filtroEstado = '';

  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // ID de la empresa actual
  empresaId: number | null = null;
  empresaNombre: string = '';  // NOMBRE DE LA EMPRESA
  contactados: Set<number> = new Set();


  // NOMBRE DE LA EMPRESA

  constructor(
    private aplicacionesService: AplicacionesService,
    private authService: AuthService,
    private curriculumService: CurriculumService
  ) { }

  ngOnInit(): void {
    this.obtenerEmpresaId();
    this.cargarContactadosDesdeStorage();
    if (this.empresaId) {
      this.cargarEstados();
      this.cargarAplicaciones();
    }
  }

  private obtenerEmpresaId(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.empresa) {
      this.empresaId = currentUser.empresa.idEmpresa;
      this.empresaNombre = currentUser.empresa.nombreEmpresa;
    } else {
      this.error = 'No se pudo obtener la información de la empresa';
    }
  }

  private cargarContactadosDesdeStorage(): void {
    const guardado = localStorage.getItem('postulantesContactados');
    if (guardado) {
      this.contactados = new Set(JSON.parse(guardado));
    }
  }
  //ENVIAR CORREO
  enviarCorreo(aplicacion: Aplicacion): void {
    Swal.fire({
      title: '¿Deseas contactar a este postulante?',
      text: 'Se enviará un correo a: ' + aplicacion.correo,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const asunto = 'Tu aplicación a ' + aplicacion.tituloOferta + ' ha sido aceptada';
        const mensaje = `Hola ${aplicacion.nombrePostulante},

Nos complace informarte que tu aplicación para la oferta "${aplicacion.tituloOferta}" ha sido aceptada por la empresa ${this.empresaNombre}.

Te contactaremos próximamente para continuar con el proceso de selección.

Saludos cordiales,  
${this.empresaNombre}`;

        this.aplicacionesService.enviarCorreo(aplicacion.correo, asunto, mensaje).subscribe({
          next: () => {
            this.contactados.add(aplicacion.idPostulante);
            this.guardarContactadosEnStorage();
            Swal.fire('Correo enviado', 'El correo fue enviado exitosamente.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Hubo un problema al enviar el correo.', 'error');
          }
        });
      }
    });
  }
  private guardarContactadosEnStorage(): void {
    localStorage.setItem('postulantesContactados', JSON.stringify(Array.from(this.contactados)));
  }
  cargarAplicaciones(): void {
    if (!this.empresaId) return;

    this.loading = true;
    this.error = null;

    this.aplicacionesService.getAplicaciones(
      this.empresaId,
      this.currentPage,
      this.pageSize,
      this.filtroEstado || undefined
    ).subscribe({
      next: (response: AplicacionesResponse) => {
        this.aplicaciones = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las aplicaciones';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cargarEstados(): void {
    if (!this.empresaId) return;

    this.aplicacionesService.getEstados(this.empresaId).subscribe({
      next: (response) => {
        this.estadosDisponibles = response.estados;
      },
      error: (error) => {
        console.error('Error al cargar estados:', error);
      }
    });
  }

  onFiltroTextoChange(): void {
    // Implementar filtro de texto en el frontend
    this.currentPage = 0;
    // Por ahora solo filtramos por estado en el backend
    // El filtro de texto se podría implementar como una búsqueda más compleja
  }

  onFiltroEstadoChange(): void {
    this.currentPage = 0;
    this.cargarAplicaciones();
  }

  cambiarEstado(aplicacion: Aplicacion, nuevoEstado: string): void {
    if (!this.empresaId) return;

    const estadoActual = aplicacion.estadoAplicacion.toLowerCase();
    const estadoNuevo = nuevoEstado.toLowerCase();

    // Regla 1: No permitir cambios si ya está aceptado o rechazado
    if (estadoActual === 'aceptado' || estadoActual === 'rechazado') {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: `La aplicación ya fue ${estadoActual}. No se puede cambiar nuevamente.`,
      });
      return;
    }

    // Regla 2: No permitir volver a pendiente
    if (estadoNuevo === 'pendiente' && estadoActual !== 'pendiente') {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede volver a Pendiente',
        text: 'Una vez que la aplicación avanza, no puede regresar a pendiente.',
      });
      return;
    }

    // Confirmación con SweetAlert
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas cambiar el estado a "${this.capitalize(nuevoEstado)}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.aplicacionesService.actualizarEstado(
          this.empresaId!,
          aplicacion.idOferta,
          aplicacion.idPostulante,
          nuevoEstado
        ).subscribe({
          next: (response) => {
            aplicacion.estadoAplicacion = response.nuevoEstado;
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado',
              text: `La aplicación fue marcada como "${this.capitalize(nuevoEstado)}".`,
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            this.error = 'Error al actualizar el estado';
            console.error('Error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el estado. Intenta nuevamente.',
            });
          }
        });
      }
    });
  }

  // Métodos auxiliares para el template
  getEstadoColor(estado: string): string {
    return this.aplicacionesService.getEstadoColor(estado);
  }

  getProgresoPorcentaje(estado: string): number {
    return this.aplicacionesService.getProgresoPorcentaje(estado);
  }

  getMensajeProgreso(estado: string): string {
    return this.aplicacionesService.getMensajeProgreso(estado);
  }

  // Paginación
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.cargarAplicaciones();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.cargarAplicaciones();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.cargarAplicaciones();
  }

  // Método para filtrar aplicaciones por texto (implementación local)
  get aplicacionesFiltradas(): Aplicacion[] {
    if (!this.filtroTexto) {
      return this.aplicaciones;
    }

    const texto = this.filtroTexto.toLowerCase();
    return this.aplicaciones.filter(aplicacion =>
      aplicacion.nombrePostulante.toLowerCase().includes(texto) ||
      aplicacion.tituloOferta.toLowerCase().includes(texto) ||
      aplicacion.correo.toLowerCase().includes(texto)
    );
  }

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  // Método para capitalizar primera letra
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  loadCurriculum(postulanteId: number): void {
    this.loadingCurriculum = true;
    this.curriculumService.getCurriculumByPostulanteId(postulanteId).subscribe({
      next: (response: any) => {
        this.curriculum = response;
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el currículum. Intente nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      },
      complete: () => {
        this.loadingCurriculum = false;
      }
    });
  }
  // Método para formatear fechas
  formatDate(dateString: string | null): string {
    if (!dateString) return 'Actualidad';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  }

  // Método para obtener el color del nivel de habilidad
  getSkillLevelClass(nivel: string): string {
    switch (nivel.toLowerCase()) {
      case 'básico':
        return 'bg-danger';
      case 'intermedio':
        return 'bg-warning';
      case 'avanzado':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
  getIniciales(): string {
    if (!this.curriculum?.nombre_completo) return '';

    const nombres = this.curriculum.nombre_completo.split(' ');

    const inicial1 = nombres[0]?.charAt(0) || '';
    const inicial2 = nombres[1]?.charAt(0) || '';

    return `${inicial1}${inicial2}`.toUpperCase();
  }
}
