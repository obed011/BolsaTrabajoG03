import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, Observable } from 'rxjs';

const API = environment.apiUrl + '/empresas';

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

export interface CategoriaPuesto {
  idPuesto: number;
  nombreCategoria: string;
}

export interface CategoriaHabilidad {
  idCategoriaHab: number;
  nomCategoriaHab: string;
}

export interface HabilidadTecnica {
  idHabilidad: number;
  idCategoriaHab: number;
  nomCategoriaHab: string;
  nomHabilidad: string;
}

export interface NivelAcademico {
  idNivAcademico: number;
  nomNivel: string;
}

export interface Especialidad {
  idEspecialidad: number;
  nomEsp: string;
  idNivelAcademico: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(private http: HttpClient) { }

  // === OFERTAS ===
  // Listar todas las ofertas de una empresa
  getOfertasPorEmpresa(idEmpresa: number): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${API}/${idEmpresa}/ofertas`);
  }

  // Obtener una oferta específica
  getOferta(idEmpresa: number, idOferta: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${API}/${idEmpresa}/ofertas/${idOferta}`);
  }

  // Crear nueva oferta
  crearOferta(idEmpresa: number, data: Omit<Oferta, 'idOferta' | 'fechaPublicacion' | 'nombreCategoriaOferta' | 'nombreEmpresa'>): Observable<Oferta> {
    return this.http.post<Oferta>(`${API}/${idEmpresa}/ofertas`, data);
  }

  // Actualizar oferta
  actualizarOferta(idEmpresa: number, idOferta: number, data: Partial<Oferta>): Observable<Oferta> {
    return this.http.put<Oferta>(`${API}/${idEmpresa}/ofertas/${idOferta}`, data);
  }

  // Eliminar oferta
  eliminarOferta(idEmpresa: number, idOferta: number): Observable<any> {
    return this.http.delete(`${API}/${idEmpresa}/ofertas/${idOferta}`);
  }

  // === CATÁLOGOS ===
  // Obtener categorías de ofertas
  getCategoriasOfertas(): Observable<CategoriaOferta[]> {
    return this.http.get<CategoriaOferta[]>(`${environment.apiUrl}/categorias-ofertas`);
  }

  // Obtener categorías de puestos (experiencia laboral)
  getCategoriasPuestos(): Observable<CategoriaPuesto[]> {
    return this.http.get<CategoriaPuesto[]>(`${environment.apiUrl}/experiencia-laboral/categorias`);
  }

  // Obtener categorías de habilidades
  getCategoriasHabilidades(): Observable<CategoriaHabilidad[]> {
    return this.http.get<CategoriaHabilidad[]>(`${environment.apiUrl}/categorias-habilidades`);
  }

  // Obtener todas las habilidades técnicas
  getHabilidadesTecnicas(): Observable<HabilidadTecnica[]> {
    return this.http.get<HabilidadTecnica[]>(`${environment.apiUrl}/habilidades-tecnicas`);
  }

  // Obtener habilidades por categoría
  getHabilidadesPorCategoria(idCategoria: number): Observable<HabilidadTecnica[]> {
    return this.http.get<HabilidadTecnica[]>(`${environment.apiUrl}/habilidades-tecnicas/categoria/${idCategoria}`);
  }

  // Obtener niveles académicos
  getNivelesAcademicos(): Observable<NivelAcademico[]> {
    return this.http.get<NivelAcademico[]>(`${environment.apiUrl}/catalogos/niveles-academicos`);
  }

  // Obtener especialidades por nivel académico
  getEspecialidadesPorNivel(idNivel: number): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${environment.apiUrl}/catalogos/especialidades/nivel/${idNivel}`);
  }
  // Obtener nombres de habilidades por IDs
  getHabilidadesPorIds(ids: number[]): Observable<HabilidadTecnica[]> {
    const requests = ids.map(id =>
      this.http.get<HabilidadTecnica>(`${environment.apiUrl}/habilidades-tecnicas/${id}`)
    );
    return forkJoin(requests);
  }

  // Obtener nombres de especialidades por IDs  
  getEspecialidadesPorIds(ids: number[]): Observable<Especialidad[]> {
    const requests = ids.map(id =>
      this.http.get<Especialidad>(`${environment.apiUrl}/catalogos/especialidades/${id}`)
    );
    return forkJoin(requests);
  }
}