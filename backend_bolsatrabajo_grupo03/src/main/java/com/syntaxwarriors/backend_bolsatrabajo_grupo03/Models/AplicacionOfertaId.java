package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import lombok.Data;
import java.io.Serializable;

@Data
public class AplicacionOfertaId implements Serializable {
    private Integer ofertaLaboral;
    private Integer postulante;
}