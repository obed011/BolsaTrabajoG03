import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterPostulanteRequest {
  correo: string;
  contrasena: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  genero?: string;
}

export interface RegisterEmpresaRequest {
  correo: string;
  contrasena: string;
  nombreEmpresa: string;
  nitEmpresa?: string;
  rubroEmpresa?: string;
  telefonoEmpresa?: string;
  direccionEmpresa?: string;
  descripcion?: string;
  sitioWeb?: string;
}

export interface PostulanteResponse {
  idPostulante: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  genero?: string;
}

export interface EmpresaResponse {
  idEmpresa: number;
  nombreEmpresa: string;
  nitEmpresa?: string;
  rubroEmpresa?: string;
  telefonoEmpresa?: string;
  direccionEmpresa?: string;
  descripcion?: string;
  sitioWeb?: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  idUsuario: number;
  correo: string;
  rol: string;
  postulante?: PostulanteResponse;
  empresa?: EmpresaResponse;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`; // Usar environment
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Flag para controlar si mostrar la alerta de bienvenida
  private showWelcomeAlert = false;

  constructor(private http: HttpClient) { 
    // Verificar si hay un token guardado al inicializar el servicio
    const token = this.getToken();
    if (token) {
      // Aquí podrías validar el token con el backend si es necesario
      const userData = this.getUserData();
      if (userData) {
        this.currentUserSubject.next(userData);
      }
    }
  }

  login(loginData: LoginRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/login`, loginData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            this.currentUserSubject.next(response.data);
            // Marcar que se debe mostrar la alerta de bienvenida
            this.showWelcomeAlert = true;
          }
          return response;
        })
      );
  }

  register(registerData: RegisterPostulanteRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/register`, registerData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            this.currentUserSubject.next(response.data);
            // Marcar que se debe mostrar la alerta de bienvenida
            this.showWelcomeAlert = true;
          }
          return response;
        })
      );
  }

  registerEmpresa(registerData: RegisterEmpresaRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/register-empresa`, registerData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            this.currentUserSubject.next(response.data);
            // Marcar que se debe mostrar la alerta de bienvenida
            this.showWelcomeAlert = true;
          }
          return response;
        })
      );
  }

  logout(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/logout`, {})
      .pipe(
        map(response => {
          this.clearSession();
          this.currentUserSubject.next(null);
          this.showWelcomeAlert = false;
          return response;
        })
      );
  }

  forceLogout(): void {
    this.clearSession();
    this.currentUserSubject.next(null);
    this.showWelcomeAlert = false;
  }

  // Método para verificar si se debe mostrar la alerta de bienvenida
  shouldShowWelcomeAlert(): boolean {
    return this.showWelcomeAlert;
  }

  // Método para marcar que ya se mostró la alerta
  markWelcomeAlertShown(): void {
    this.showWelcomeAlert = false;
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult));
  }

  public clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserData(): AuthResponse | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Verificar si el token no ha expirado (opcional)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.rol === role : false;
  }

  isPostulante(): boolean {
    return this.hasRole('POSTULANTE');
  }

  isEmpresa(): boolean {
    return this.hasRole('EMPRESA');
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}