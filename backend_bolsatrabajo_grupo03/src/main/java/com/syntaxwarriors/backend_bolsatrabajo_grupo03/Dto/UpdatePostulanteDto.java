package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePostulanteDto {

    @Size(min = 2, max = 50, message = "Los nombres deben tener entre 2 y 50 caracteres")
    private String nombres;

    @Size(min = 2, max = 50, message = "Los apellidos deben tener entre 2 y 50 caracteres")
    private String apellidos;

    @Pattern(regexp = "^[67]\\d{7}$", message = "El teléfono celular debe tener 8 dígitos y comenzar con 6 o 7")
    private String telCelular;

    @Pattern(regexp = "^2\\d{7}$", message = "El teléfono fijo debe tener 8 dígitos y comenzar con 2")
    private String telFijo;

    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;

    @Size(min = 10, max = 100, message = "La dirección debe tener entre 10 y 100 caracteres")
    private String direccion;

    @Pattern(regexp = "^(Masculino|Femenino|Otro)$", message = "El género debe ser: Masculino, Femenino u Otro")
    private String genero;

    private Boolean esNacional;

    @Pattern(regexp = "^\\d{8}-\\d$", message = "El DUI debe tener el formato: 12345678-9")
    private String dui;

    @Size(min = 8, max = 20, message = "El pasaporte debe tener entre 8 y 20 caracteres")
    private String pasaporte;

    @Pattern(regexp = "^\\d{4}-\\d{6}-\\d{3}-\\d$", message = "El NIT debe tener el formato: 1234-567890-123-4")
    private String nit;

    @Size(min = 10, max = 20, message = "El NUP debe tener entre 10 y 20 caracteres")
    private String nup;

    @Pattern(regexp = "^https://github\\.com/[\\w\\-\\.]+/?$",
            message = "El enlace de GitHub debe ser una URL válida de GitHub")
    private String linkGithub;

    @Pattern(regexp = "^https://linkedin\\.com/in/[\\w\\-\\.]+/?$",
            message = "El enlace de LinkedIn debe ser una URL válida de LinkedIn")
    private String linkLinkedin;
}