package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExperienciaLaboralDTO {
    private Integer idExperiencia;
    private String nomOrganizacion;
    private String nomPuesto;
    private String funciones;
    private String contactoOrganizacion;
    private LocalDate inicioExp;
    private LocalDate finExp;
    private Boolean trabajoActual;
    private Integer idPuesto;
    private String nombreCategoria;
    private Integer idPostulante;
}
