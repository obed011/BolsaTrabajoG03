package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "habilidad_postulante")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Habilidades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_hab_postulante")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_postulante", nullable = false)
    private Postulante postulante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_habilidad", nullable = false)
    private HabilidadTecnica habilidadTecnica;

    @Column(name = "nivel_hab", length = 10, nullable = false)
    private String nivel;
}
