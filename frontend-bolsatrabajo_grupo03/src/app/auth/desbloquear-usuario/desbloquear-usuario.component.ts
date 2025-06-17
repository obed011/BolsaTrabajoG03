import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-desbloquear-usuario',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './desbloquear-usuario.component.html',
  styleUrl: './desbloquear-usuario.component.css'
})
export class DesbloquearUsuarioComponent {
  correo: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  solicitarDesbloqueo() {
    this.loading = true;
    this.http.post<{ success: boolean, message: string }>(
      `${environment.apiUrl}/usuarios/solicitar-desbloqueo`,
      { correo: this.correo }
    ).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire(
          res.success ? '¡Éxito!' : 'Aviso',
          res.message,
          res.success ? 'success' : 'info'
        ).then(() => {
          if (res.success) {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        const mensaje = err?.error?.message || err?.error || 'No se pudo enviar el correo.';
        Swal.fire('Error', mensaje, 'error');
      }      
    });
  }
}
