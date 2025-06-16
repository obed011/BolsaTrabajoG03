package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AplicacionOfertaDTO {
    private Integer idOferta;
    private Integer idPostulante;
    private LocalDate fechaAplicacion;
    private String estadoAplicacion;

    // Para respuestas con información adicional
    private String tituloOferta;
    private String nombreEmpresa;
    private String nombrePostulante;
}