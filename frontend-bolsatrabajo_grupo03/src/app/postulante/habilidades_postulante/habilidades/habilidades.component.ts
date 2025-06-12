import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabilidadesService, Habilidad } from '../../../services/habilidades.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habilidades',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './habilidades.component.html',
  styleUrl: './habilidades.component.css'
})
export class HabilidadesComponent implements OnInit {
  habilidades: Habilidad[] = [];
  habilidadesAgrupadas: { [categoria: string]: Habilidad[] } = {};
  loading = true;
  error: string | null = null;

  // Variables para el modal de eliminación
  showDeleteModal = false;
  habilidadAEliminar: number | null = null;

  constructor(
    private router: Router,
    private habilidadesService: HabilidadesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('Iniciando carga de habilidades...');

    const currentUser = this.authService.getCurrentUser();
    console.log('Usuario actual:', currentUser);

    const id = currentUser?.postulante?.idPostulante;
    console.log('ID del postulante:', id);

    if (id) {
      this.habilidadesService.getHabilidadesPorPostulante(id).subscribe({
        next: (data) => {
          console.log('Datos recibidos:', data);
          this.habilidades = data || [];
          this.agruparHabilidadesPorCategoria();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar habilidades:', error);
          this.error = 'Error al cargar las habilidades';
          this.loading = false;
        }
      });
    } else {
      console.error('No se encontró ID del postulante');
      this.error = 'No se pudo identificar al usuario';
      this.loading = false;
    }
  }

  agruparHabilidadesPorCategoria(): void {
    this.habilidadesAgrupadas = {};
    this.habilidades.forEach(habilidad => {
      const categoria = habilidad.nomCategoriaHab || 'Sin categoría';
      if (!this.habilidadesAgrupadas[categoria]) {
        this.habilidadesAgrupadas[categoria] = [];
      }
      this.habilidadesAgrupadas[categoria].push(habilidad);
    });
  }

  getCategoriasKeys(): string[] {
    return Object.keys(this.habilidadesAgrupadas);
  }

  getTotalHabilidades(): number {
    return this.habilidades.length;
  }

  eliminar(id: number): void {
    this.habilidadAEliminar = id;
    this.showDeleteModal = true;
  }

  editar(idHabilidad: number): void {
    this.router.navigate(['/postulante/habilidades/editar', idHabilidad]);
  }

  confirmarEliminacion(): void {
    if (this.habilidadAEliminar) {
      this.habilidadesService.eliminarHabilidad(this.habilidadAEliminar).subscribe({
        next: () => {
          this.habilidades = this.habilidades.filter(hab => hab.idHabilidad !== this.habilidadAEliminar);
          this.agruparHabilidadesPorCategoria();
          this.cerrarModal();

          // SweetAlert de éxito
          Swal.fire({
            title: '¡Eliminado!',
            text: 'La habilidad ha sido eliminada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error al eliminar habilidad:', error);
          this.cerrarModal();

          // SweetAlert de error
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la habilidad.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  cerrarModal(): void {
    this.showDeleteModal = false;
    this.habilidadAEliminar = null;
  }

  getNivelClass(nivel: string): string {
    switch (nivel?.toLowerCase()) {
      case 'básico':
      case 'basico':
        return 'bg-warning text-dark';
      case 'intermedio':
        return 'bg-secondary text-dark';
      case 'avanzado':
        return 'bg-success text-white';
      default:
        return 'bg-secondary text-white';
    }
  }
}