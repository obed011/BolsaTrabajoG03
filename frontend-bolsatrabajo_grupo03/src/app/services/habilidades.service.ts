import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API = environment.apiUrl + '/habilidades';
const CATALOGOS_API = environment.apiUrl;

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

export interface Habilidad {
  idHabilidad?: number;
  idPostulante: number;
  idHabilidadTecnica: number;
  nomHabilidad?: string;
  idCategoriaHab?: number;
  nomCategoriaHab?: string;
  nivel: string;
}

@Injectable({
  providedIn: 'root'
})
export class HabilidadesService {

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías de habilidades
  getCategoriasHabilidades(): Observable<CategoriaHabilidad[]> {
    return this.http.get<CategoriaHabilidad[]>(`${CATALOGOS_API}/categorias-habilidades`);
  }

  // Obtener habilidades técnicas por categoría
  getHabilidadesPorCategoria(idCategoria: number): Observable<HabilidadTecnica[]> {
    return this.http.get<HabilidadTecnica[]>(`${CATALOGOS_API}/habilidades-tecnicas/categoria/${idCategoria}`);
  }

  // Crear habilidad para un postulante
  crearHabilidad(data: Habilidad): Observable<Habilidad> {
    return this.http.post<Habilidad>(API, data);
  }

  // Obtener habilidades por postulante
  getHabilidadesPorPostulante(id: number): Observable<Habilidad[]> {
    return this.http.get<Habilidad[]>(`${API}/postulante/${id}`);
  }

  // Obtener habilidad específica
  getHabilidad(id: number): Observable<Habilidad> {
    return this.http.get<Habilidad>(`${API}/${id}`);
  }

  // Actualizar habilidad
  actualizarHabilidad(id: number, data: Habilidad): Observable<Habilidad> {
    return this.http.put<Habilidad>(`${API}/${id}`, data);
  }

  // Eliminar habilidad
  eliminarHabilidad(id: number): Observable<any> {
    return this.http.delete(`${API}/${id}`);
  }
}