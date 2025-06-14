package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "experiencia_laboral")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExperienciaLaboral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_experiencia")
    private Integer idExperiencia;

    @Column(name = "nom_organizacion", length = 50, nullable = false)
    private String nomOrganizacion;

    @Column(name = "nom_puesto", length = 75, nullable = false)
    private String nomPuesto;

    @Column(name = "funciones", length = 200, nullable = false)
    private String funciones;

    @Column(name = "contacto_organizacion", length = 10, nullable = false)
    private String contactoOrganizacion;

    @Column(name = "inicio_exp", nullable = false)
    private LocalDate inicioExp;

    @Column(name = "fin_exp")
    private LocalDate finExp;

    @Column(name = "trabajo_actual", nullable = false)
    private Boolean trabajoActual;

    @Column(name = "fyh_creacion_experiencia", nullable = false)
    private LocalDate fhCreacion;

    @Column(name = "fyh_actualizacion_experiencia")
    private LocalDate fhActualizacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cat_puesto", nullable = false)
    private CategoriaPuesto categoriaPuesto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_postulante", nullable = false)
    private Postulante postulante;

    @PrePersist
    protected void onCreate() {
        this.fhCreacion = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fhActualizacion = LocalDate.now();
    }
}
