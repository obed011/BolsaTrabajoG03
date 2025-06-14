package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "postulante")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Postulante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postulante")
    private Integer idPostulante;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "nombres", length = 50, nullable = false)
    private String nombres;

    @Column(name = "apellidos", length = 50, nullable = false)
    private String apellidos;

    @Column(name = "tel_celular", length = 10, nullable = false)
    private String telCelular;

    @Column(name = "tel_fijo", length = 10)
    private String telFijo;

    @Column(name = "fec_nac", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "direccion_post", length = 100, nullable = false)
    private String direccion;

    @Column(name = "genero", length = 25, nullable = false)
    private String genero;

    @Column(name = "es_nacional")
    private Boolean esNacional;

    @Column(name = "dui", length = 10)
    private String dui;

    @Column(name = "pasaporte", length = 20)
    private String pasaporte;

    @Column(name = "nit", length = 20)
    private String nit;

    @Column(name = "nup", length = 20)
    private String nup;

    @Column(name = "foto_perfil", columnDefinition = "TEXT")
    private String fotoPerfil;

    @Column(name = "link_github", length = 100)
    private String linkGithub;

    @Column(name = "link_linkedin", length = 100)
    private String linkLinkedin;

    @Column(name = "estado_perfil")
    private Boolean estadoPerfil;

    @Column(name = "fyh_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "fyh_actualizacion")
    private LocalDate fechaActualizacion;

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDate.now();
        this.estadoPerfil = false;
    }
    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDate.now();
    }
}

