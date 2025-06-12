package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "tb_especialidad_academica")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EspecialidadAcademica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especialidad")
    private Integer idEspecialidad;

    @Column(name = "nom_esp", length = 100, nullable = false)
    private String nomEsp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_niv_academico", nullable = false)
    private NivelAcademico nivelAcademico;

    @OneToMany(mappedBy = "especialidadAcademica", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FormacionAcademica> formacionesAcademicas;
}