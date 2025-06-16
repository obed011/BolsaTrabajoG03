package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "vw_postulantes_empresa")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VwPostulantesEmpresa {

    @Id
    @Column(name = "id_empresa")
    private Integer idEmpresa;

    @Column(name = "id_oferta")
    private Integer idOferta;

    @Column(name = "titulo_oferta")
    private String tituloOferta;

    @Column(name = "id_postulante")
    private Integer idPostulante;

    @Column(name = "nombre_postulante")
    private String nombrePostulante;

    @Column(name = "correo")
    private String correo;

    @Column(name = "tel_celular")
    private String telCelular;

    @Column(name = "direccion_post")
    private String direccionPost;

    @Column(name = "fecha_aplicacion")
    private LocalDate fechaAplicacion;

    @Column(name = "estado_aplicacion")
    private String estadoAplicacion;

    @Column(name = "habilidades_match")
    private Integer habilidadesMatch;

    @Column(name = "total_habilidades_requeridas")
    private Integer totalHabilidadesRequeridas;

    @Column(name = "formacion_match")
    private Boolean formacionMatch;

    @Column(name = "experiencia_match")
    private Boolean experienciaMatch;

    @Column(name = "puntaje")
    private Integer puntaje;
}