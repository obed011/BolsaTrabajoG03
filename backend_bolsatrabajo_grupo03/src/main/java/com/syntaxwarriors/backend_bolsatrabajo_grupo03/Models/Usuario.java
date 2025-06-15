package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "usuario") //
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "correo", length = 50, nullable = false, unique = true)
    private String correo;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @Column(name = "estado_user", nullable = false)
    private Boolean estado = true;

    @Column(name = "fyh_creacion_user", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "intentos_login_fallidos")
    private Integer intentosLoginFallidos;

    @Column(name = "fyh_bloqueo")
    private LocalDate fechaBloqueo;

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDate.now();
        this.intentosLoginFallidos = 0; // Inicializar intentos de login fallidos a 0
        this.fechaBloqueo = null; // Inicializar fecha de bloqueo a null
    }
}
