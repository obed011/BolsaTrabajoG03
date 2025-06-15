package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rq_experiencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RqExperiencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rq_experiencia")
    private Integer idRqExperiencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_oferta", nullable = false)
    @JsonIgnore
    private OfertaLaboral ofertaLaboral;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cat_puesto", nullable = false)
    private CategoriaPuesto categoriaPuesto;

    @Column(name = "puesto_rq", length = 200, nullable = false)
    private String puestoRq;

    @Column(name = "anos_exp", nullable = false)
    private Integer anosExp;
}