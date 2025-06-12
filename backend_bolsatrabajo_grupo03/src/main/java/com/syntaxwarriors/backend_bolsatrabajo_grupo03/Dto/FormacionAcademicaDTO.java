package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormacionAcademicaDTO {
    private Integer idFormacion;
    private String nombreInstitucion;
    private Integer inicioFormacion;
    private Integer finFormacion;
    private Boolean enCurso;
    private Integer idPostulante;
    private Integer idEspecialidad;
    private String nombreEspecialidad;
    private Integer idNivelAcademico;
    private String nombreNivelAcademico;
    private LocalDate fyhCreacion;
    private LocalDate fyhActualizacion;
}