import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Aplicacion {
  idEmpresa: number;
  idOferta: number;
  tituloOferta: string;
  idPostulante: number;
  nombrePostulante: string;
  correo: string;
  telCelular: string;
  direccionPost: string;
  fechaAplicacion: string;
  estadoAplicacion: string;
  habilidadesMatch: number;
  totalHabilidadesRequeridas: number;
  formacionMatch: boolean;
  experienciaMatch: boolean;
  puntaje: number;
}

export interface AplicacionesResponse {
  content: Aplicacion[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

export interface EstadosResponse {
  estados: string[];
}

export interface ActualizarEstadoRequest {
  estado: string;
}

export interface ActualizarEstadoResponse {
  nuevoEstado: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class AplicacionesService {
  private readonly API_URL = `${environment.apiUrl}/empresas`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  enviarCorreo(destino: string, asunto: string, mensaje: string) {
    return this.http.post<any>(`${environment.apiUrl}/correos/enviar`, {
      destino,
      asunto,
      mensaje
    });
  }
  // Obtener todas las aplicaciones de la empresa
  getAplicaciones(
    empresaId: number,
    page: number = 0,
    size: number = 10,
    estado?: string,
    ofertaId?: number
  ): Observable<AplicacionesResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (estado) {
      params = params.set('estado', estado);
    }

    if (ofertaId) {
      params = params.set('ofertaId', ofertaId.toString());
    }

    return this.http.get<AplicacionesResponse>(
      `${this.API_URL}/${empresaId}/aplicaciones`,
      {
        headers: this.authService.getAuthHeaders(),
        params
      }
    );
  }

  // Obtener aplicaciones de una oferta específica
  getAplicacionesPorOferta(
    empresaId: number,
    ofertaId: number,
    page: number = 0,
    size: number = 10
  ): Observable<AplicacionesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<AplicacionesResponse>(
      `${this.API_URL}/${empresaId}/aplicaciones/oferta/${ofertaId}`,
      {
        headers: this.authService.getAuthHeaders(),
        params
      }
    );
  }

  // Actualizar estado de una aplicación
  actualizarEstado(
    empresaId: number,
    ofertaId: number,
    postulanteId: number,
    nuevoEstado: string
  ): Observable<ActualizarEstadoResponse> {
    const body: ActualizarEstadoRequest = { estado: nuevoEstado };

    return this.http.put<ActualizarEstadoResponse>(
      `${this.API_URL}/${empresaId}/aplicaciones/oferta/${ofertaId}/postulante/${postulanteId}/estado`,
      body,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Obtener estados disponibles
  getEstados(empresaId: number): Observable<EstadosResponse> {
    return this.http.get<EstadosResponse>(
      `${this.API_URL}/${empresaId}/aplicaciones/estados`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Método auxiliar para obtener el color del estado
  getEstadoColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'bg-warning';
      case 'revision': return 'bg-info';
      case 'aceptado': return 'bg-success';
      case 'rechazado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  // Método auxiliar para obtener el porcentaje de progreso
  getProgresoPorcentaje(estado: string): number {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 25;
      case 'revision': return 50;
      case 'rechazado': return 100;
      case 'aceptado': return 100;
      default: return 0;
    }
  }

  // Método auxiliar para obtener mensaje de progreso
  getMensajeProgreso(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'Aplicación recibida. En espera de revisión inicial.';
      case 'revision': return 'Aplicación en proceso de evaluación por el equipo de recursos humanos.';
      case 'aceptado': return '¡Enhorabuena! La aplicación ha sido aceptada.';
      case 'rechazado': return 'La aplicación no ha sido seleccionada para esta posición.';
      default: return 'Estado desconocido.';
    }
  }

  // Método auxiliar para calcular puntaje de compatibilidad
  calcularCompatibilidad(aplicacion: Aplicacion): number {
    return aplicacion.puntaje;
  }
}