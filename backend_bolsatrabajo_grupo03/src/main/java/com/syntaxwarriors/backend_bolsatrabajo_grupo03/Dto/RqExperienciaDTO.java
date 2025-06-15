package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RqExperienciaDTO {
    private Integer idRqExperiencia;
    private Integer idCategoriaPuesto;
    private String puestoRq;
    private Integer anosExp;

    // Para respuestas
    private String nombreCategoria;
}
