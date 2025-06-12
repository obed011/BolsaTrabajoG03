package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "tb_categoria_habilidad")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaHabilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria_hab")
    private Integer idCategoriaHab;

    @Column(name = "nom_categoria_hab", length = 50, nullable = false)
    private String nomCategoriaHab;
}
