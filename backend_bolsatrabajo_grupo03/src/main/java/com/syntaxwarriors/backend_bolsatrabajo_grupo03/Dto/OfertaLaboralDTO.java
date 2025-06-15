package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaLaboralDTO {
    private Integer idOferta;
    private Integer idEmpresa;
    private Integer idCategoriaOferta;
    private String tituloOferta;
    private String descripcionOferta;
    private BigDecimal salario;
    private String ubicacion;
    private String modalidad;
    private LocalDate fechaExpiracion;
    private LocalDate fechaPublicacion;
    private List<RqExperienciaDTO> requerimientosExperiencia;
    private List<Integer> habilidadesRequeridas;
    private List<Integer> especialidadesRequeridas;

    // Para respuestas
    private String nombreCategoriaOferta;
    private String nombreEmpresa;
}
