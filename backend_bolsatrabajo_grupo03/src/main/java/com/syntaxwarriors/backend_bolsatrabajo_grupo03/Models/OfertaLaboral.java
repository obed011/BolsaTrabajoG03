package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "oferta_laboral")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaLaboral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_oferta")
    private Integer idOferta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa", nullable = false)
    @JsonIgnore
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cat__oferta", nullable = false)
    private CategoriaOferta categoriaOferta;

    @Column(name = "titulo_oferta", length = 100, nullable = false)
    private String tituloOferta;

    @Column(name = "descripcion_oferta", length = 250, nullable = false)
    private String descripcionOferta;

    @Column(name = "salario", precision = 10, scale = 2, nullable = false)
    private BigDecimal salario;

    @Column(name = "ubicacion", length = 100, nullable = false)
    private String ubicacion;

    @Column(name = "modalidad", length = 50, nullable = false)
    private String modalidad;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDate fechaExpiracion;

    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDate fechaPublicacion;

    @Column(name = "fyh_creacion_of", nullable = false)
    private LocalDate fyhCreacionOf;

    @Column(name = "fyh_actualizacion_of")
    private LocalDate fyhActualizacionOf;

    @OneToMany(mappedBy = "ofertaLaboral", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RqExperiencia> requerimientosExperiencia;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "habilidades_puesto",
            joinColumns = @JoinColumn(name = "id_oferta"),
            inverseJoinColumns = @JoinColumn(name = "id_habilidad")
    )
    private List<HabilidadTecnica> habilidadesRequeridas;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "oferta_especialidad",
            joinColumns = @JoinColumn(name = "id_oferta"),
            inverseJoinColumns = @JoinColumn(name = "id_especialidad")
    )
    private List<EspecialidadAcademica> especialidadesRequeridas;
}
