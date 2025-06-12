package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabilidadesDTO {
    private Integer idHabilidad;
    private Integer idPostulante;
    private Integer idHabilidadTecnica;
    private String nomHabilidad;
    private Integer idCategoriaHab;
    private String nomCategoriaHab;
    private String nivel;
}