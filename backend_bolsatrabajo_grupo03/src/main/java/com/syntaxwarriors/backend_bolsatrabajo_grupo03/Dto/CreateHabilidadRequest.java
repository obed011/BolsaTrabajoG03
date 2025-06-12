package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateHabilidadRequest {
    private Integer idPostulante;
    private Integer idHabilidadTecnica;
    private String nivel;
}