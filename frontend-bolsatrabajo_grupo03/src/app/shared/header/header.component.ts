import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(public authService: AuthService) { }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    if (user) {
      if (user.postulante) {
        const nombres = user.postulante.nombres.split(' ');
        const apellidos = user.postulante.apellidos.split(' ');
        return `${nombres[0]} ${apellidos[0]}`;
      } else if (user.empresa) {
        return user.empresa.nombreEmpresa;
      }
    }
    return 'Usuario';
  }

  getDashboardRoute(): string {
    const user = this.authService.getCurrentUser();
    if (user) {
      if (user.postulante) {
        return '/postulante';
      } else if (user.empresa) {
        return '/empresa';
      }
    }
    return '/dashboard';
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout exitoso:', response);
        // Aquí podrías redirigir o mostrar un mensaje
      },
      error: (error) => {
        console.error('Error al hacer logout:', error);
        // En caso de error, forzar logout local
        this.authService.forceLogout();
      }
    });
  }
}