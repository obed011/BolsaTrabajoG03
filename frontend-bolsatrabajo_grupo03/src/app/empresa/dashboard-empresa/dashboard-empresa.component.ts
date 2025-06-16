import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-empresa',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard-empresa.component.html',
  styleUrl: './dashboard-empresa.component.css'
})
export class DashboardEmpresaComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.currentUser = this.authService.getCurrentUser();
    
    // Mostrar alerta de bienvenida si es necesario
    this.showWelcomeAlert();
  }

  private showWelcomeAlert(): void {
    // Verificar si se debe mostrar la alerta de bienvenida
    if (this.authService.shouldShowWelcomeAlert() && this.currentUser) {
      // Usar setTimeout para asegurar que el componente esté completamente inicializado
      setTimeout(() => {
        const nombreEmpresa = this.currentUser?.empresa?.nombreEmpresa || 'Empresa';
        
        Swal.fire({
          title: '¡Bienvenido!',
          html: `
            <div style="text-align: center;">
              <p style="font-size: 20px; margin-bottom: 10px;">
                Hola <strong>${nombreEmpresa}</strong>
              </p>
            </div>
          `,
          icon: 'success',
          showConfirmButton: false,
          timer: 3000, // Se cierra automáticamente después de 3 segundos
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });

        // Marcar que ya se mostró la alerta
        this.authService.markWelcomeAlertShown();
      }, 300);
    }
  }

  logout(): void {
    this.loading = true;
    
    const nombreEmpresa = this.currentUser?.empresa?.nombreEmpresa || 'Empresa';
    Swal.fire({
      title: '¡Hasta pronto!',
      html: `
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">👋</div>
          <p style="font-size: 20px; margin-bottom: 10px;">
            Gracias por usar nuestros servicios, <strong>${nombreEmpresa}</strong>
          </p>
          <p style="color: #666; font-size: 14px;">
            Tu sesión se está cerrando...
          </p>
        </div>
      `,
      timer: 3000,
      showConfirmButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout exitoso:', response);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error en logout:', error);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  isCollapsed = false;
  isMobile = false;
  activeMenuItem = 'resumen'; // Elemento activo por defecto

  menuItems = [
    // { id: 'resumen', icon: 'bi bi-file-text', label: 'Resumen', route: '/empresa/home' },
    // { id: 'perfil-empresa', icon: 'bi bi-building', label: 'Perfil Empresa', route: '/empresa/perfil' },
    { id: 'mis-ofertas', icon: 'bi bi-briefcase', label: 'Mis Ofertas', route: '/empresa/ofertas' },
    // { id: 'candidatos', icon: 'bi bi-people', label: 'Candidatos', route: '/empresa/candidatos' },
    // { id: 'entrevistas', icon: 'bi bi-chat-dots', label: 'Entrevistas', route: '/empresa/entrevistas' },
    { id: 'aplicaciones', icon: 'bi bi-file-earmark-text', label: 'Aplicaciones', route: '/empresa/aplicaciones' },
  ];

  footerItems = [
    { id: 'configuracion', icon: 'bi bi-gear', label: 'Configuración', route: '/dashboard/configuracion' },
    { id: 'cerrar-sesion', icon: 'bi bi-box-arrow-right', label: 'Cerrar Sesión', route: '' }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isCollapsed = false;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  setActiveMenuItem(itemId: string) {
    this.activeMenuItem = itemId;
    this.closeSidebar();
  }

  isActive(itemId: string): boolean {
    return this.activeMenuItem === itemId;
  }
  getCurrentDateTime(): string {
    return new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}