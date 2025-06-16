package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "aplicacion_oferta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(AplicacionOfertaId.class)
public class AplicacionOferta {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_oferta", nullable = false)
    private OfertaLaboral ofertaLaboral;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_postulante", nullable = false)
    private Postulante postulante;

    @Column(name = "fecha_aplicacion", nullable = false)
    private LocalDate fechaAplicacion;

    @Column(name = "estado_aplicacion", length = 10, nullable = false)
    private String estadoAplicacion; // por defecto "pendiente"

    @PrePersist
    public void prePersist() {
        this.fechaAplicacion = LocalDate.now();
        this.estadoAplicacion = "pendiente";
    }
}

