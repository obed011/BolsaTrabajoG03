import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, Observable, map } from 'rxjs';

export interface RequerimientoExperiencia {
  idRqExperiencia?: number;
  idCategoriaPuesto: number;
  nombreCategoria?: string;
  puestoRq: string;
  anosExp: number;
}

export interface Oferta {
  idOferta?: number;
  idEmpresa: number;
  idCategoriaOferta: number;
  nombreCategoriaOferta?: string;
  tituloOferta: string;
  descripcionOferta: string;
  salario: number;
  ubicacion: string;
  modalidad: string;
  fechaExpiracion: string;
  fechaPublicacion?: string;
  nombreEmpresa?: string;
  requerimientosExperiencia: RequerimientoExperiencia[];
  habilidadesRequeridas: number[];
  especialidadesRequeridas: number[];
  habilidadesNombres?: HabilidadTecnica[];
  especialidadesNombres?: Especialidad[];
}

export interface CategoriaOferta {
  idCatOferta: number;
  nomCatOferta: string;
}

export interface HabilidadTecnica {
  idHabilidad: number;
  idCategoriaHab: number;
  nomCategoriaHab: string;
  nomHabilidad: string;
}

export interface Especialidad {
  idEspecialidad: number;
  nomEsp: string;
  idNivelAcademico: number;
}

export interface AplicacionResponse {
  haAplicado: boolean;
}

// Interfaz actualizada según la respuesta de tu backend
export interface Aplicacion {
  idOferta: number;
  idPostulante: number;
  fechaAplicacion: string;
  estadoAplicacion: string;
  tituloOferta: string;
  nombreEmpresa: string;
  nombrePostulante: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfertasPostulantesService {

  constructor(private http: HttpClient) { }

  // === OFERTAS PARA POSTULANTES ===
  
  // Obtener todas las ofertas activas
  getOfertasActivas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${environment.apiUrl}/postulantes/ofertas`);
  }

  // Obtener ofertas por categoría
  getOfertasPorCategoria(categoriaId: number): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${environment.apiUrl}/postulantes/ofertas/categoria/${categoriaId}`);
  }

  // Obtener detalle de una oferta
  getDetalleOferta(ofertaId: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${environment.apiUrl}/postulantes/ofertas/${ofertaId}`);
  }

  // Aplicar a una oferta
  aplicarOferta(postulanteId: number, ofertaId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/postulantes/${postulanteId}/aplicar/${ofertaId}`, {});
  }

  // Verificar si ya aplicó a una oferta
  verificarAplicacion(postulanteId: number, ofertaId: number): Observable<AplicacionResponse> {
    return this.http.get<AplicacionResponse>(`${environment.apiUrl}/postulantes/${postulanteId}/ofertas/${ofertaId}/aplicado`);
  }

  // Obtener aplicaciones del postulante - ACTUALIZADO
  getMisAplicaciones(postulanteId: number): Observable<Aplicacion[]> {
    return this.http.get<Aplicacion[]>(`${environment.apiUrl}/postulantes/${postulanteId}/aplicaciones`);
  }

  // === CATÁLOGOS ===
  
  // Obtener categorías de ofertas
  getCategoriasOfertas(): Observable<CategoriaOferta[]> {
    return this.http.get<CategoriaOferta[]>(`${environment.apiUrl}/categorias-ofertas`);
  }

  // Obtener nombres de habilidades por IDs
  getHabilidadesPorIds(ids: number[]): Observable<HabilidadTecnica[]> {
    if (ids.length === 0) return new Observable(observer => observer.next([]));
    
    const requests = ids.map(id =>
      this.http.get<HabilidadTecnica>(`${environment.apiUrl}/habilidades-tecnicas/${id}`)
    );
    return forkJoin(requests);
  }

  // Obtener nombres de especialidades por IDs  
  getEspecialidadesPorIds(ids: number[]): Observable<Especialidad[]> {
    if (ids.length === 0) return new Observable(observer => observer.next([]));
    
    const requests = ids.map(id =>
      this.http.get<Especialidad>(`${environment.apiUrl}/catalogos/especialidades/${id}`)
    );
    return forkJoin(requests);
  }

  // Método auxiliar para enriquecer ofertas con nombres de habilidades y especialidades
  enrichOfertaWithNames(oferta: Oferta): Observable<Oferta> {
    const habilidades$ = this.getHabilidadesPorIds(oferta.habilidadesRequeridas);
    const especialidades$ = this.getEspecialidadesPorIds(oferta.especialidadesRequeridas);

    return forkJoin({
      habilidades: habilidades$,
      especialidades: especialidades$
    }).pipe(
      map(result => ({
        ...oferta,
        habilidadesNombres: result.habilidades,
        especialidadesNombres: result.especialidades
      }))
    );
  }

  // Enriquecer múltiples ofertas
  enrichOfertasWithNames(ofertas: Oferta[]): Observable<Oferta[]> {
    const enrichedOfertas$ = ofertas.map(oferta => this.enrichOfertaWithNames(oferta));
    return forkJoin(enrichedOfertas$);
  }
}