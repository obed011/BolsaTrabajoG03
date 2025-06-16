import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfertasPostulantesService, Aplicacion } from '../../services/ofertas-postulantes.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aplicaciones',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './aplicaciones.component.html',
  styleUrl: './aplicaciones.component.css'
})
export class AplicacionesComponent implements OnInit {
  aplicaciones: Aplicacion[] = [];
  aplicacionesFiltradas: Aplicacion[] = [];
  loading: boolean = true;
  error: string = '';
  postulanteId: number = 0;
  
  // Filtros
  busqueda: string = '';
  estadoFiltro: string = '';

  constructor(
    private ofertasService: OfertasPostulantesService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.postulante?.idPostulante) {
      this.postulanteId = user.postulante.idPostulante;
    } else {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarMisAplicaciones();
  }

  cargarMisAplicaciones(): void {
    this.loading = true;
    this.error = '';

    this.ofertasService.getMisAplicaciones(this.postulanteId).subscribe({
      next: (aplicaciones) => {
        this.aplicaciones = aplicaciones;
        this.aplicacionesFiltradas = [...aplicaciones];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar aplicaciones:', error);
        this.error = 'Error al cargar tus aplicaciones. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  // Filtrar aplicaciones
  filtrarAplicaciones(): void {
    this.aplicacionesFiltradas = this.aplicaciones.filter(aplicacion => {
      const matchBusqueda = this.busqueda === '' || 
        aplicacion.tituloOferta.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        aplicacion.nombreEmpresa.toLowerCase().includes(this.busqueda.toLowerCase());
      
      const matchEstado = this.estadoFiltro === '' || 
        aplicacion.estadoAplicacion.toLowerCase() === this.estadoFiltro.toLowerCase();
      
      return matchBusqueda && matchEstado;
    });
  }

  // Obtener estados únicos para el filtro
  getEstadosUnicos(): string[] {
    const estados = this.aplicaciones.map(app => app.estadoAplicacion);
    return [...new Set(estados)];
  }

  verDetalle(idOferta: number): void {
    this.router.navigate(['/ofertas', idOferta]);
  }

  irAOfertas(): void {
    this.router.navigate(['/empleos']);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  obtenerColorEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-warning text-dark';
      case 'en revisión':
      case 'en revision':
        return 'bg-info text-white';
      case 'aceptado':
      case 'aprobado':
        return 'bg-success text-white';
      case 'rechazado':
        return 'bg-danger text-white';
      case 'entrevista programada':
        return 'bg-primary text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  obtenerProgreso(estado: string): number {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 25;
      case 'en revisión':
      case 'en revision':
        return 50;
      case 'entrevista programada':
        return 75;
      case 'aceptado':
      case 'aprobado':
        return 100;
      case 'rechazado':
        return 100;
      default:
        return 25;
    }
  }

  obtenerMensajeProgreso(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'Aplicación enviada correctamente. En espera de revisión.';
      case 'en revisión':
      case 'en revision':
        return 'Tu aplicación está siendo revisada por el equipo de recursos humanos.';
      case 'entrevista programada':
        return 'Felicidades! Tu entrevista ha sido programada.';
      case 'aceptado':
      case 'aprobado':
        return '¡Enhorabuena! Has sido seleccionado para esta posición.';
      case 'rechazado':
        return 'Gracias por tu interés. En esta ocasión no has sido seleccionado.';
      default:
        return 'Estado de aplicación actualizado.';
    }
  }

  obtenerColorProgreso(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'rechazado':
        return 'bg-danger';
      case 'aceptado':
      case 'aprobado':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  }

  // Función para contar aplicaciones por estado
  contarPorEstado(estado: string): number {
    return this.aplicaciones.filter(app => app.estadoAplicacion.toLowerCase() === estado.toLowerCase()).length;
  }
}