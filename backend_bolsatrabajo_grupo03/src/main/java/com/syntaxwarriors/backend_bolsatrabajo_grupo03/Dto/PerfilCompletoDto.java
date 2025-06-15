package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerfilCompletoDto {
    private Boolean perfilCompleto;
    private String mensaje;
    private Integer porcentajeCompletado;
    private String[] camposFaltantes;
}
