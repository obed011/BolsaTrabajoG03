package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.sql.Timestamp;

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

    @Column(name = "nom_organizacion", length = 50)
    private String nomOrganizacion;

    @Column(name = "nom_puesto", length = 75)
    private String nomPuesto;

    @Column(name = "funciones", length = 200)
    private String funciones;

    @Column(name = "contacto_organizacion", length = 10)
    private String contactoOrganizacion;

    @Column(name = "inicio_exp")
    private LocalDate inicioExp;

    @Column(name = "fin_exp")
    private LocalDate finExp;

    @Column(name = "trabajo_actual")
    private Boolean trabajoActual;

    @Column(name = "fh_creacion")
    private Timestamp fhCreacion;

    @Column(name = "fh_actualizacion", nullable = true)
    private Timestamp fhActualizacion;

    // Relación con CategoriaPuesto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_puesto", referencedColumnName = "id_puesto")
    private CategoriaPuesto categoriaPuesto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_postulante", referencedColumnName = "id_postulante")
    private Postulante postulante;

    @PrePersist
    protected void onCreate() {
        fhCreacion = new Timestamp(System.currentTimeMillis());
    }

    @PreUpdate
    protected void onUpdate() {
        fhActualizacion = new Timestamp(System.currentTimeMillis());
    }
}