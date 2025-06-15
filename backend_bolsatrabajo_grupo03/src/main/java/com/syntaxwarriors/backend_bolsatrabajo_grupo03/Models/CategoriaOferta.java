package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "categoria_oferta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaOferta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cat__oferta")
    private Integer idCatOferta;

    @Column(name = "nom_cat_oferta", length = 100, nullable = false)
    private String nomCatOferta;
}
