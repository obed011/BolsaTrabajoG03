package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabilidadTecnicaDTO {
    private Integer idHabilidad;
    private Integer idCategoriaHab;
    private String nomCategoriaHab;
    private String nomHabilidad;
}
