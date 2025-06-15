package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostulanteDto {
    private Integer idPostulante;
    private String correo;
    private String nombres;
    private String apellidos;
    private String telCelular;
    private String telFijo;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String genero;
    private Boolean esNacional;
    private String dui;
    private String pasaporte;
    private String nit;
    private String nup;
    private String fotoPerfil;
    private String linkGithub;
    private String linkLinkedin;
    private Boolean estadoPerfil;
    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;
}