import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OfertasPostulantesService, Oferta, CategoriaOferta } from '../../../services/ofertas-postulantes.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-empleos',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './empleos.component.html',
  styleUrl: './empleos.component.css'
})
export class EmpleosComponent implements OnInit {
  ofertas: Oferta[] = [];
  ofertasFiltradas: Oferta[] = [];
  categorias: CategoriaOferta[] = [];
  categoriaSeleccionada: number = 0;
  terminoBusqueda: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(
    private ofertasService: OfertasPostulantesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    forkJoin({
      ofertas: this.ofertasService.getOfertasActivas(),
      categorias: this.ofertasService.getCategoriasOfertas()
    }).subscribe({
      next: (data) => {
        this.categorias = data.categorias;
        // Enriquecer ofertas con nombres de habilidades y especialidades
        this.ofertasService.enrichOfertasWithNames(data.ofertas).subscribe({
          next: (ofertasEnriquecidas) => {
            this.ofertas = ofertasEnriquecidas;
            this.ofertasFiltradas = [...this.ofertas];
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al enriquecer ofertas:', error);
            this.ofertas = data.ofertas;
            this.ofertasFiltradas = [...this.ofertas];
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.error = 'Error al cargar las ofertas. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  filtrarOfertas(): void {
    let ofertas = [...this.ofertas];

    // Filtrar por categoría
    if (this.categoriaSeleccionada > 0) {
      ofertas = ofertas.filter(oferta => oferta.idCategoriaOferta === this.categoriaSeleccionada);
    }

    // Filtrar por término de búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      ofertas = ofertas.filter(oferta =>
        oferta.tituloOferta.toLowerCase().includes(termino) ||
        oferta.descripcionOferta.toLowerCase().includes(termino) ||
        oferta.nombreEmpresa?.toLowerCase().includes(termino) ||
        oferta.ubicacion.toLowerCase().includes(termino)
      );
    }

    this.ofertasFiltradas = ofertas;
  }

  onCategoriaChange(): void {
    this.filtrarOfertas();
  }

  onBusquedaChange(): void {
    this.filtrarOfertas();
  }

  verDetalle(idOferta: number): void {
    this.router.navigate(['/ofertas', idOferta]);
  }

  formatearSalario(salario: number): string {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(salario);
  }

  obtenerColorModalidad(modalidad: string): string {
    switch (modalidad.toLowerCase()) {
      case 'remoto':
        return 'badge-success';
      case 'presencial':
        return 'badge-primary';
      case 'híbrido':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  calcularDiasRestantes(fechaExpiracion: string): number {
    const hoy = new Date();
    const fechaExp = new Date(fechaExpiracion);
    const diferencia = fechaExp.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = 0;
    this.terminoBusqueda = '';
    this.filtrarOfertas();
  }
}
