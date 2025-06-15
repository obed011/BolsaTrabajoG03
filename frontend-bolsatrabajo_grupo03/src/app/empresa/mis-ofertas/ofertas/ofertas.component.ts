import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfertasService, Oferta } from '../../../services/ofertas.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ofertas',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css'
})
export class OfertasComponent implements OnInit {
  ofertas: Oferta[] = [];
  loading = true;
  error: string | null = null;

  // Variables para el modal de eliminación
  showDeleteModal = false;
  ofertaAEliminar: number | null = null;

  // Variables para el modal de detalle
  showDetailModal = false;
  ofertaDetalle: Oferta | null = null;
  loadingDetalle = false;

  // ID de la empresa (obtenido del usuario autenticado)
  idEmpresa: number | null = null;

  constructor(
    private ofertasService: OfertasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('Iniciando carga de ofertas...');

    const currentUser = this.authService.getCurrentUser();
    console.log('Usuario actual:', currentUser);

    // Asumiendo que el usuario tiene una propiedad empresa con idEmpresa
    this.idEmpresa = currentUser?.empresa?.idEmpresa ?? null;
    console.log('ID de la empresa:', this.idEmpresa);

    if (this.idEmpresa) {
      this.cargarOfertas();
    } else {
      console.error('No se encontró ID de la empresa');
      this.error = 'No se pudo identificar a la empresa';
      this.loading = false;
    }
  }

  cargarOfertas(): void {
    if (!this.idEmpresa) return;

    this.loading = true;
    this.error = null;

    this.ofertasService.getOfertasPorEmpresa(this.idEmpresa).subscribe({
      next: (data) => {
        console.log('Ofertas recibidas:', data);
        this.ofertas = data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar ofertas:', error);
        this.error = 'Error al cargar las ofertas de trabajo';
        this.loading = false;
      }
    });
  }

  verDetalle(oferta: Oferta): void {
    this.ofertaDetalle = oferta;
    this.showDetailModal = true;
    
    // Cargar nombres de habilidades y especialidades
    if (oferta.habilidadesRequeridas?.length > 0) {
      this.ofertasService.getHabilidadesPorIds(oferta.habilidadesRequeridas).subscribe(habilidades => {
        this.ofertaDetalle!.habilidadesNombres = habilidades;
      });
    }
    
    if (oferta.especialidadesRequeridas?.length > 0) {
      this.ofertasService.getEspecialidadesPorIds(oferta.especialidadesRequeridas).subscribe(especialidades => {
        this.ofertaDetalle!.especialidadesNombres = especialidades;
      });
    }
  }

  eliminar(idOferta: number): void {
    this.ofertaAEliminar = idOferta;
    this.showDeleteModal = true;
  }

  confirmarEliminacion(): void {
    if (this.ofertaAEliminar && this.idEmpresa) {
      this.ofertasService.eliminarOferta(this.idEmpresa, this.ofertaAEliminar).subscribe({
        next: () => {
          this.ofertas = this.ofertas.filter(oferta => oferta.idOferta !== this.ofertaAEliminar);
          this.cerrarModalEliminar();

          // SweetAlert de éxito
          Swal.fire({
            title: '¡Eliminado!',
            text: 'La oferta de trabajo ha sido eliminada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error al eliminar oferta:', error);
          this.cerrarModalEliminar();

          // SweetAlert de error
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la oferta de trabajo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  cerrarModalEliminar(): void {
    this.showDeleteModal = false;
    this.ofertaAEliminar = null;
  }

  cerrarModalDetalle(): void {
    this.showDetailModal = false;
    this.ofertaDetalle = null;
  }

  // Función para formatear la fecha
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Función para formatear el salario
  formatearSalario(salario: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(salario);
  }

  // Función para determinar el estado de la oferta
  getEstadoOferta(fechaExpiracion: string): { texto: string, clase: string } {
    const hoy = new Date();
    const fechaExp = new Date(fechaExpiracion);
    const diasRestantes = Math.ceil((fechaExp.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return { texto: 'Expirada', clase: 'badge bg-danger' };
    } else if (diasRestantes <= 7) {
      return { texto: `${diasRestantes} días restantes`, clase: 'badge bg-warning text-dark' };
    } else {
      return { texto: 'Activa', clase: 'badge bg-success' };
    }
  }

  // Función para obtener el color de la modalidad
  getModalidadClase(modalidad: string): string {
    switch (modalidad?.toLowerCase()) {
      case 'remoto':
        return 'badge bg-primary';
      case 'presencial':
        return 'badge bg-info';
      case 'híbrido':
      case 'hibrido':
        return 'badge bg-secondary';
      default:
        return 'badge bg-light text-dark';
    }
  }
}