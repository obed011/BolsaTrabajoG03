import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormacionAcademicaService, FormacionAcademica } from '../../../services/formacion-academica.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formacion-academica',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './formacion-academica.component.html',
  styleUrl: './formacion-academica.component.css'
})
export class FormacionAcademicaComponent implements OnInit {
  formaciones: FormacionAcademica[] = [];
  loading = true;
  error: string | null = null;

  // Variables para el modal de eliminación
  showDeleteModal = false;
  formacionAEliminar: number | null = null;

  constructor(
    private router: Router,
    private formacionService: FormacionAcademicaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('Iniciando carga de formaciones...');

    const currentUser = this.authService.getCurrentUser();
    console.log('Usuario actual:', currentUser);

    const id = currentUser?.postulante?.idPostulante;
    console.log('ID del postulante:', id);

    if (id) {
      this.formacionService.getFormacionesPorPostulante(id).subscribe({
        next: (data) => {
          console.log('Datos recibidos:', data);
          this.formaciones = data || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar formaciones:', error);
          this.error = 'Error al cargar las formaciones académicas';
          this.loading = false;
        }
      });
    } else {
      console.error('No se encontró ID del postulante');
      this.error = 'No se pudo identificar al usuario';
      this.loading = false;
    }
  }

  eliminar(id: number): void {
    this.formacionAEliminar = id;
    this.showDeleteModal = true;
  }

  editar(idFormacion: number): void {
    this.router.navigate(['/postulante/educacion/editar', idFormacion]);
  }

  confirmarEliminacion(): void {
    if (this.formacionAEliminar) {
      this.formacionService.eliminarFormacion(this.formacionAEliminar).subscribe({
        next: () => {
          this.formaciones = this.formaciones.filter(form => form.idFormacion !== this.formacionAEliminar);
          this.cerrarModal();

          // SweetAlert de éxito
          Swal.fire({
            title: '¡Eliminado!',
            text: 'La formación académica ha sido eliminada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error al eliminar formación:', error);
          this.cerrarModal();

          // SweetAlert de error
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la formación académica.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  cerrarModal(): void {
    this.showDeleteModal = false;
    this.formacionAEliminar = null;
  }
}