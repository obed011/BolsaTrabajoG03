package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "nivel_academico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NivelAcademico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_niv_academico")
    private Integer idNivAcademico;

    @Column(name = "nom_nivel", length = 75, nullable = false)
    private String nomNivel;

    @OneToMany(mappedBy = "nivelAcademico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EspecialidadAcademica> especialidades;
}
