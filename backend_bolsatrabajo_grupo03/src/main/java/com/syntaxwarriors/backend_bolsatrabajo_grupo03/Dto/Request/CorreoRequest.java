package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request;

import lombok.Data;

@Data
public class CorreoRequest {
    private String destino;
    private String asunto;
    private String mensaje;
}
