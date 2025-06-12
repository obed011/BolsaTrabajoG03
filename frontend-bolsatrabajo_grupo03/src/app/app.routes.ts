import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistroPostulanteComponent } from './auth/registro/registro-postulante/registro-postulante.component';
import { RegistroEmpresaComponent } from './auth/registro/registro-empresa/registro-empresa.component';
import { InicioComponent } from './pages/inicio/inicio.component';
// Paginas del postulante
import { DashboardPostulanteComponent } from './postulante/dashboard-postulante/dashboard-postulante.component';
import { PerfilComponent } from './postulante/perfil/perfil.component';
import { ExperienciaLaboralComponent } from './postulante/experiencias-laboral/experiencia-laboral/experiencia-laboral.component';
import { FormacionAcademicaComponent } from './postulante/formaciones_academicas/formacion-academica/formacion-academica.component';
import { HabilidadesComponent } from './postulante/habilidades/habilidades.component';
import { AplicacionesComponent } from './postulante/aplicaciones/aplicaciones.component';
import { HomePostulanteComponent } from './postulante/home-postulante/home-postulante.component';

// Paginas de la empresa
import { DashboardEmpresaComponent } from './empresa/dashboard-empresa/dashboard-empresa.component';
import { HomeEmpresaComponent } from './empresa/home-empresa/home-empresa.component';
import { PerfilEmpresaComponent } from './empresa/perfil-empresa/perfil-empresa.component';
import { OfertasComponent } from './empresa/ofertas/ofertas.component';
import { CandidatosComponent } from './empresa/candidatos/candidatos.component';
import { EntrevistasComponent } from './empresa/entrevistas/entrevistas.component';
import { AplicacionesOfertasComponent } from './empresa/aplicaciones-ofertas/aplicaciones-ofertas.component';
import { authGuard } from './services/auth.guard';
import { Pagina404Component } from './pages/pagina-404/pagina-404.component';
import { FormularioExperienciaComponent } from './postulante/experiencias-laboral/formulario-experiencia/formulario-experiencia.component';
import { FormularioFormacionComponent } from './postulante/formaciones_academicas/formulario-formacion/formulario-formacion.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'not-found', component: Pagina404Component },
    { path: 'inicio', component: InicioComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro-candidatos', component: RegistroPostulanteComponent },
    { path: 'registro-empresas', component: RegistroEmpresaComponent },
    {
        path: 'postulante',
        component: DashboardPostulanteComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomePostulanteComponent, canActivate: [authGuard] },
            { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
            { path: 'experiencia-laboral', component: ExperienciaLaboralComponent, canActivate: [authGuard] },
            { path: 'experiencia-laboral/nuevo', component: FormularioExperienciaComponent, canActivate: [authGuard] },
            { path: 'experiencia-laboral/editar/:id', component: FormularioExperienciaComponent, canActivate: [authGuard] },
            { path: 'educacion', component: FormacionAcademicaComponent, canActivate: [authGuard] },
            { path: 'educacion/nueva', component: FormularioFormacionComponent, canActivate: [authGuard] },
            { path: 'educacion/editar/:id', component: FormularioFormacionComponent, canActivate: [authGuard] },
            { path: 'habilidades', component: HabilidadesComponent, canActivate: [authGuard] },
            { path: 'aplicaciones', component: AplicacionesComponent, canActivate: [authGuard] }
        ]
    },
    {
        path: 'empresa',
        component: DashboardEmpresaComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeEmpresaComponent, canActivate: [authGuard] },
            { path: 'perfil', component: PerfilEmpresaComponent, canActivate: [authGuard] },
            { path: 'ofertas', component: OfertasComponent, canActivate: [authGuard] },
            { path: 'candidatos', component: CandidatosComponent, canActivate: [authGuard] },
            { path: 'entrevistas', component: EntrevistasComponent, canActivate: [authGuard] },
            { path: 'aplicaciones', component: AplicacionesOfertasComponent, canActivate: [authGuard] }
        ]
    },

    { path: '**', redirectTo: 'not-found' }
];
