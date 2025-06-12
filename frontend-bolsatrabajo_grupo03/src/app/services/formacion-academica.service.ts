import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API = environment.apiUrl + '/formacion-academica';
const CATALOGOS_API = environment.apiUrl + '/catalogos';

export interface FormacionAcademica {
  idFormacion?: number;
  nombreInstitucion: string;
  inicioFormacion: number;
  finFormacion?: number | null;
  idPostulante: number;
  idEspecialidad: number;
  nombreEspecialidad?: string;
  idNivelAcademico?: number;
  nombreNivelAcademico?: string;
  enCurso: boolean;
  fyhCreacion?: string;
  fyhActualizacion?: string | null;
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
export class FormacionAcademicaService {

  constructor(private http: HttpClient) {}

  // Obtener niveles académicos
  getNivelesAcademicos(): Observable<NivelAcademico[]> {
    return this.http.get<NivelAcademico[]>(`${CATALOGOS_API}/niveles-academicos`);
  }

  // Obtener especialidades por nivel académico
  getEspecialidadesPorNivel(idNivel: number): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${CATALOGOS_API}/especialidades/nivel/${idNivel}`);
  }

  // Crear formación académica
  crearFormacion(data: FormacionAcademica): Observable<FormacionAcademica> {
    return this.http.post<FormacionAcademica>(API, data);
  }

  // Obtener formaciones por postulante
  getFormacionesPorPostulante(id: number): Observable<FormacionAcademica[]> {
    return this.http.get<FormacionAcademica[]>(`${API}/postulante/${id}`);
  }

  // Obtener formación específica
  getFormacion(id: number): Observable<FormacionAcademica> {
    return this.http.get<FormacionAcademica>(`${API}/${id}`);
  }

  // Actualizar formación
  actualizarFormacion(id: number, data: FormacionAcademica): Observable<FormacionAcademica> {
    return this.http.put<FormacionAcademica>(`${API}/${id}`, data);
  }

  // Eliminar formación
  eliminarFormacion(id: number): Observable<any> {
    return this.http.delete(`${API}/${id}`);
  }
}
