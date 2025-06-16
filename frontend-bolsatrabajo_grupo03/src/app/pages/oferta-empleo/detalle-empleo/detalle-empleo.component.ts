import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OfertasPostulantesService, Oferta } from '../../../services/ofertas-postulantes.service';
import { AuthService } from '../../../services/auth.service';

declare var bootstrap: any; // Para usar Bootstrap modal

@Component({
  selector: 'app-detalle-empleo',
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './detalle-empleo.component.html',
  styleUrl: './detalle-empleo.component.css'
})

export class DetalleEmpleoComponent implements OnInit {
  oferta: Oferta | null = null;
  loading: boolean = true;
  error: string = '';
  yaAplicado: boolean = false;
  aplicando: boolean = false;
  postulanteId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ofertasService: OfertasPostulantesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.postulante?.idPostulante) {
      this.postulanteId = user.postulante.idPostulante;
    }

    this.route.params.subscribe(params => {
      const idOferta = +params['id'];
      if (idOferta) {
        this.cargarDetalleOferta(idOferta);
        this.verificarAplicacion(idOferta);
      }
    });
  }

  cargarDetalleOferta(idOferta: number): void {
    this.loading = true;
    this.error = '';

    this.ofertasService.getDetalleOferta(idOferta).subscribe({
      next: (oferta) => {
        // Enriquecer la oferta con nombres de habilidades y especialidades
        this.ofertasService.enrichOfertaWithNames(oferta).subscribe({
          next: (ofertaEnriquecida) => {
            this.oferta = ofertaEnriquecida;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al enriquecer oferta:', error);
            this.oferta = oferta; // Usar sin enriquecer si falla
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
        this.error = 'Error al cargar el detalle de la oferta. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  verificarAplicacion(idOferta: number): void {
    this.ofertasService.verificarAplicacion(this.postulanteId, idOferta).subscribe({
      next: (response) => {
        this.yaAplicado = response.haAplicado;
      },
      error: (error) => {
        console.error('Error al verificar aplicación:', error);
        // No mostramos error al usuario, solo no sabremos si ya aplicó
      }
    });
  }

  aplicarOferta(): void {
    if (!this.oferta || this.yaAplicado) return;

    this.aplicando = true;

    this.ofertasService.aplicarOferta(this.postulanteId, this.oferta.idOferta!).subscribe({
      next: (response) => {
        this.aplicando = false;
        this.yaAplicado = true;
        this.mostrarModalConfirmacion();
      },
      error: (error) => {
        console.error('Error al aplicar:', error);
        this.aplicando = false;

        // Manejar diferentes tipos de error
        if (error.status === 400) {
          this.error = 'Ya has aplicado a esta oferta anteriormente.';
          this.yaAplicado = true;
        } else if (error.status === 404) {
          this.error = 'La oferta ya no está disponible.';
        } else {
          this.error = 'Error al aplicar a la oferta. Por favor, intenta de nuevo.';
        }
      }
    });
  }

  mostrarModalConfirmacion(): void {
    const modalElement = document.getElementById('modalConfirmacion');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  volver(): void {
    this.router.navigate(['/empleos']);
  }

  formatearSalario(salario: number): string {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(salario);
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'No disponible';

    return new Date(fecha).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerColorModalidad(modalidad: string): string {
    switch (modalidad.toLowerCase()) {
      case 'remoto':
        return 'bg-success';
      case 'presencial':
        return 'bg-warning';
      case 'híbrido':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  calcularDiasRestantes(fechaExpiracion: string): number {
    const hoy = new Date();
    const fechaExp = new Date(fechaExpiracion);
    const diferencia = fechaExp.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }
}
