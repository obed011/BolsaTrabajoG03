package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "formacion_academica")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormacionAcademica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_formacion")
    private Integer idFormacion;

    @Column(name = "nombre_institucion_edu", length = 100, nullable = false)
    private String nombreInstitucion;

    @Column(name = "inicio_formacion_edu", nullable = false)
    private Integer inicioFormacion;

    @Column(name = "fin_formacion_edu")
    private Integer finFormacion;

    @Column(name = "en_curso_edu", nullable = false)
    private Boolean enCurso;

    @Column(name = "fyh_creacion_educacion", nullable = false)
    private LocalDate fyhCreacion;

    @Column(name = "fyh_actualizacion_educacion")
    private LocalDate fyhActualizacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_postulante", nullable = false)
    private Postulante postulante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_especialidad", nullable = false)
    private EspecialidadAcademica especialidadAcademica;

    @PrePersist
    protected void onCreate() {
        fyhCreacion = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fyhActualizacion = LocalDate.now();
    }
}

