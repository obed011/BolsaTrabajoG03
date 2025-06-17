import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-desbloqueo-confirmado',
  templateUrl: './desbloqueo-confirmado.component.html',
  styleUrls: ['./desbloqueo-confirmado.component.css']
})
export class DesbloqueoConfirmadoComponent implements OnInit {

  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.post(`${environment.apiUrl}/usuarios/desbloquear-token`, { token }).subscribe({
        next: (res: any) => {
          this.loading = false;
          Swal.fire('¡Cuenta desbloqueada!', res.message || 'Ya puedes iniciar sesión.', 'success')
            .then(() => this.router.navigate(['/login']));
        },
        error: (err) => {
          this.loading = false;
          Swal.fire('Token inválido o expirado', err?.error?.message || 'Solicita otro correo de desbloqueo.', 'error')
            .then(() => this.router.navigate(['/desbloquear']));
        }
      });
    } else {
      this.loading = false;
      Swal.fire('Token faltante', 'El enlace es incorrecto.', 'warning')
        .then(() => this.router.navigate(['/']));
    }
  }
}
