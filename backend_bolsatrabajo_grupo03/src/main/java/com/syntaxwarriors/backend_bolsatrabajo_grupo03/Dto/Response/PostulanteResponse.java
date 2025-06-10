package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PostulanteResponse {
    private Integer idPostulante;
    private String nombres;
    private String apellidos;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String genero;
}
