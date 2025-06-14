package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresa")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa")
    private Integer idEmpresa;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "nom_empresa", length = 50, nullable = false)
    private String nombreEmpresa;

    @Column(name = "nit_empresa", length = 20, nullable = false)
    private String nitEmpresa;

    @Column(name = "rubro", length = 50, nullable = false)
    private String rubroEmpresa;

    @Column(name = "tel_empresa", length = 10, nullable = false)
    private String telefonoEmpresa;

    @Column(name = "direccion_emp", length = 100, nullable = false)
    private String direccionEmpresa;

    @Column(name = "descripcion_empresa", length = 200, nullable = false)
    private String descripcion;

    @Column(name = "sitio_web", length = 100)
    private String sitioWeb;

    @Column(name = "logo", length = 100)
    private String logo;

    @Column(name = "estado_empresa")
    private Boolean estadoEmpresa;

    @Column(name = "fyh_creacion_empresa", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "fyh_actualizacion_empresa")
    private LocalDate fechaActualizacion;

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDate.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDate.now();
    }
}

