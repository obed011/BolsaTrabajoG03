package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AplicacionEmpresaDTO {
    private Integer idEmpresa;
    private Integer idOferta;
    private String tituloOferta;
    private Integer idPostulante;
    private String nombrePostulante;
    private String correo;
    private String telCelular;
    private String direccionPost;
    private LocalDate fechaAplicacion;
    private String estadoAplicacion;
    private Integer habilidadesMatch;
    private Integer totalHabilidadesRequeridas;
    private Boolean formacionMatch;
    private Boolean experienciaMatch;
    private Integer puntaje;
}
