import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API = environment.apiUrl + '/postulantes';

export interface Postulante {
  idPostulante?: number;
  nombres: string;
  apellidos: string;
  telCelular: string;
  telFijo?: string;
  fechaNacimiento?: string;
  direccion: string;
  genero: string;
  esNacional: boolean;
  dui: string;
  pasaporte?: string;
  nit?: string;
  nup?: string;
  fotoPerfil?: string;
  linkGithub?: string;
  linkLinkedin?: string;
  correo?: string;
  fechaRegistro?: string;
  perfilCompleto?: boolean;
}

export interface FotoRequest {
  foto: string; // Base64 string
}

@Injectable({
  providedIn: 'root'
})
export class PostulanteService {

  constructor(private http: HttpClient) {}

  // Obtener perfil del postulante autenticado
  getPerfil(): Observable<Postulante> {
    return this.http.get<Postulante>(`${API}/perfil`);
  }

  // Actualizar perfil del postulante
  actualizarPerfil(data: Postulante): Observable<any> {
    return this.http.put(`${API}/perfil`, data);
  }

  // Subir foto de perfil
  subirFoto(fotoData: FotoRequest): Observable<any> {
    return this.http.post(`${API}/perfil/foto`, fotoData);
  }

  // Verificar si el perfil está completo
  verificarPerfilCompleto(): Observable<{ completo: boolean }> {
    return this.http.get<{ completo: boolean }>(`${API}/perfil/completado`);
  }
}