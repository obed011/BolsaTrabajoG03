import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API = environment.apiUrl + '/experiencia-laboral';

export interface ExperienciaLaboral {
  idExperiencia: number;
  nomOrganizacion: string;
  nomPuesto: string;
  funciones: string;
  contactoOrganizacion?: string;
  inicioExp: string;
  finExp?: string;
  trabajoActual: boolean;
  idPuesto: number;
  idPostulante: number;
  nombreCategoria?: string;
}

@Injectable({
  providedIn: 'root'
})


export class ExperienciaLaboralService {

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/categorias`);
  }

  crearExperiencia(data: ExperienciaLaboral): Observable<any> {
    return this.http.post(API, data);
  }

  getExperienciasPorPostulante(id: number): Observable<ExperienciaLaboral[]> {
    return this.http.get<ExperienciaLaboral[]>(`${API}/postulante/${id}`);
  }

  getExperiencia(id: number): Observable<ExperienciaLaboral> {
    return this.http.get<ExperienciaLaboral>(`${API}/${id}`);
  }

  actualizarExperiencia(id: number, data: ExperienciaLaboral): Observable<any> {
    return this.http.put(`${API}/${id}`, data);
  }

  eliminarExperiencia(id: number): Observable<any> {
    return this.http.delete(`${API}/${id}`);
  }
}
