import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienciaLaboralService, ExperienciaLaboral } from '../../../services/experiencia-laboral.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-experiencia-laboral',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './experiencia-laboral.component.html',
  styleUrl: './experiencia-laboral.component.css'
})
export class ExperienciaLaboralComponent implements OnInit {
  experiencias: ExperienciaLaboral[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private experienciaService: ExperienciaLaboralService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('Iniciando carga de experiencias...');

    const currentUser = this.authService.getCurrentUser();
    console.log('Usuario actual:', currentUser);

    const id = currentUser?.postulante?.idPostulante;
    console.log('ID del postulante:', id);

    if (id) {
      this.experienciaService.getExperienciasPorPostulante(id).subscribe({
        next: (data) => {
          console.log('Datos recibidos:', data);
          this.experiencias = data || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar experiencias:', error);
          this.error = 'Error al cargar las experiencias';
          this.loading = false;
        }
      });
    } else {
      console.error('No se encontró ID del postulante');
      this.error = 'No se pudo identificar al usuario';
      this.loading = false;
    }
  }
  // Variables para el modal de eliminación
  showDeleteModal = false;
  experienciaAEliminar: number | null = null;

  eliminar(id: number): void {
    this.experienciaAEliminar = id;
    this.showDeleteModal = true;
  }

  editar(idExperiencia: number): void {
    this.router.navigate(['/postulante/experiencia-laboral/editar', idExperiencia]);
  }

  confirmarEliminacion(): void {
    if (this.experienciaAEliminar) {
      this.experienciaService.eliminarExperiencia(this.experienciaAEliminar).subscribe({
        next: () => {
          this.experiencias = this.experiencias.filter(exp => exp.idExperiencia !== this.experienciaAEliminar);
          this.cerrarModal();

          // SweetAlert de éxito
          Swal.fire({
            title: '¡Eliminado!',
            text: 'La experiencia laboral ha sido eliminada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error al eliminar experiencia:', error);
          this.cerrarModal();

          // SweetAlert de error
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la experiencia laboral.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  cerrarModal(): void {
    this.showDeleteModal = false;
    this.experienciaAEliminar = null;
  }
}