package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EspecialidadAcademicaDTO {
    private Integer idEspecialidad;
    private String nomEsp;
    private Integer idNivelAcademico;
}