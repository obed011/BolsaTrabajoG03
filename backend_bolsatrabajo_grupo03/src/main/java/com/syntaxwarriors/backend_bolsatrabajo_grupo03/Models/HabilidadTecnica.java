package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "habilidades_tecnicas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabilidadTecnica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_habilidad")
    private Integer idHabilidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria_hab", nullable = false)
    private CategoriaHabilidad categoriaHabilidad;

    @Column(name = "nom_habilidad", length = 50, nullable = false)
    private String nomHabilidad;
}

