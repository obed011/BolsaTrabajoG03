import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { CurriculumService } from '../../services/curriculum.service';
import Swal from 'sweetalert2';

// Interface para el curriculum
interface FormacionAcademica {
  institucion: string;
  especialidad: string;
  nivel: string;
  inicio: number;
  fin: number;
}

interface ExperienciaLaboral {
  organizacion: string;
  puesto: string;
  funciones: string;
  inicio: string;
  fin: string | null;
}

interface Habilidad {
  habilidad: string;
  nivel: string;
}

interface CurriculumResponse {
  id_postulante: number;
  nombre_completo: string;
  genero: string;
  telefono: string;
  direccion: string;
  formacion_academica: FormacionAcademica[];
  experiencia_laboral: ExperienciaLaboral[];
  habilidades: Habilidad[];
}

@Component({
  selector: 'app-dashboard-postulante',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard-postulante.component.html',
  styleUrl: './dashboard-postulante.component.css'
})
export class DashboardPostulanteComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  loading = false;
  curriculum: CurriculumResponse | null = null;
  loadingCurriculum = false;

  constructor(
    private authService: AuthService,
    private curriculumService: CurriculumService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        const nombreCompleto = this.currentUser?.postulante 
          ? `${this.currentUser.postulante.nombres} ${this.currentUser.postulante.apellidos}`
          : 'Usuario';
        
        Swal.fire({
          title: '¡Bienvenido!',
          html: `
            <div style="text-align: center;">
              <p style="font-size: 20px; margin-bottom: 10px;">
                Hola <strong>${nombreCompleto}</strong>
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

  // Método para cargar el currículum
  loadCurriculum(): void {
    if (!this.currentUser?.postulante?.idPostulante) {
      console.error('No se encontró el ID del postulante');
      return;
    }

    this.loadingCurriculum = true;
    this.curriculumService.getCurriculumByPostulanteId(this.currentUser.postulante.idPostulante).subscribe({
      next: (response: any) => {
        this.curriculum = response;
        console.log('Currículum cargado:', response);
      },
      error: (error) => {
        console.error('Error al cargar el currículum:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el currículum. Intente nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      },
      complete: () => {
        this.loadingCurriculum = false;
      }
    });
  }

  // Método para formatear fechas
  formatDate(dateString: string | null): string {
    if (!dateString) return 'Actualidad';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
  }

  // Método para obtener el color del nivel de habilidad
  getSkillLevelClass(nivel: string): string {
    switch (nivel.toLowerCase()) {
      case 'básico':
        return 'bg-danger';
      case 'intermedio':
        return 'bg-warning';
      case 'avanzado':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  logout(): void {
    this.loading = true;
    const nombreCompleto = this.currentUser?.postulante 
      ? `${this.currentUser.postulante.nombres} ${this.currentUser.postulante.apellidos}`
      : 'Usuario';
    
    Swal.fire({
      title: '¡Hasta pronto!',
      html: `
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">👋</div>
          <p style="font-size: 20px; margin-bottom: 10px;">
            Que tengas un excelente día, <strong>${nombreCompleto}</strong>
          </p>
          <p style="color: #666; font-size: 16px;">
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
    { id: 'resumen', icon: 'bi bi-file-text', label: 'Resumen', route: '/postulante/home' },
    { id: 'datos-personales', icon: 'bi bi-person', label: 'Datos Personales', route: '/postulante/perfil' },
    { id: 'experiencia', icon: 'bi bi-briefcase', label: 'Experiencia Laboral', route: '/postulante/experiencia-laboral' },
    { id: 'educacion', icon: 'bi bi-mortarboard', label: 'Educación', route: '/postulante/educacion' },
    // { id: 'certificaciones', icon: 'bi bi-award', label: 'Certificaciones', route: '/dashboard/certificaciones' },
    { id: 'habilidades', icon: 'bi bi-star', label: 'Habilidades', route: '/postulante/habilidades' },
    // { id: 'idiomas', icon: 'bi bi-translate', label: 'Idiomas', route: '/dashboard/idiomas' },
    // { id: 'logros', icon: 'bi bi-trophy', label: 'Logros y Premios', route: '/dashboard/logros' },
    // { id: 'referencias', icon: 'bi bi-people', label: 'Referencias', route: '/dashboard/referencias' },
    // { id: 'eventos', icon: 'bi bi-calendar-event', label: 'Eventos', route: '/dashboard/eventos' },
    // { id: 'publicaciones', icon: 'bi bi-journal-text', label: 'Publicaciones', route: '/dashboard/publicaciones' },
    // { id: 'examenes', icon: 'bi bi-clipboard-check', label: 'Exámenes', route: '/dashboard/examenes' },
    { id: 'aplicaciones', icon: 'bi bi-send', label: 'Aplicaciones', route: '/postulante/aplicaciones' },
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
  
  getShortName(): string {
    const user = this.currentUser;
    if (user?.postulante) {
      const firstName = user.postulante.nombres?.split(' ')[0] || '';
      const lastName = user.postulante.apellidos?.split(' ')[0] || '';
      return `${firstName} ${lastName}`.trim();
    }
    return '';
  }
}