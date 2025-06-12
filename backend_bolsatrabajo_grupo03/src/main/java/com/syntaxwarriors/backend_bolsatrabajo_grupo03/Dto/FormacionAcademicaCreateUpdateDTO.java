package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormacionAcademicaCreateUpdateDTO {
    @NotBlank(message = "El nombre de la institución es obligatorio")
    @Size(max = 100, message = "El nombre de la institución no puede exceder 100 caracteres")
    private String nombreInstitucion;

    @NotNull(message = "El año de inicio de formación es obligatorio")
    private Integer inicioFormacion;

    private Integer finFormacion;

    @NotNull(message = "Debe indicar si está en curso")
    private Boolean enCurso;

    @NotNull(message = "El ID del postulante es obligatorio")
    private Integer idPostulante;

    @NotNull(message = "El ID de la especialidad es obligatorio")
    private Integer idEspecialidad;
}