package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExperienciaLaboralCreateDTO {
    @NotBlank(message = "El nombre de la organización es requerido")
    @Size(max = 50, message = "El nombre de la organización no debe exceder 50 caracteres")
    private String nomOrganizacion;

    @NotBlank(message = "El nombre del puesto es requerido")
    @Size(max = 75, message = "El nombre del puesto no debe exceder 75 caracteres")
    private String nomPuesto;

    @Size(max = 200, message = "Las funciones no deben exceder 200 caracteres")
    private String funciones;

    @Size(max = 10, message = "El contacto no debe exceder 10 caracteres")
    private String contactoOrganizacion;

    @NotNull(message = "La fecha de inicio es requerida")
    private LocalDate inicioExp;

    private LocalDate finExp;

    private Boolean trabajoActual = false;

    @NotNull(message = "La categoría del puesto es requerida")
    private Integer idPuesto;

    @NotNull(message = "El ID del postulante es requerido")
    private Integer idPostulante;
}


