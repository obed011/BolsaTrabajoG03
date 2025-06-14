package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Habilidades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HabilidadesRepository extends JpaRepository<Habilidades, Integer> {

    @Query("SELECT h FROM Habilidades h WHERE h.postulante.idPostulante = :postulanteId")
    List<Habilidades> findByPostulanteId(@Param("postulanteId") Integer postulanteId);

    // CAMBIO: Consulta por categoría a través de HabilidadTecnica
    @Query("SELECT h FROM Habilidades h WHERE h.postulante.idPostulante = :postulanteId AND h.habilidadTecnica.categoriaHabilidad.idCategoriaHab = :categoriaId")
    List<Habilidades> findByPostulanteIdAndCategoriaId(@Param("postulanteId") Integer postulanteId, @Param("categoriaId") Integer categoriaId);

    @Query("SELECT COUNT(h) > 0 FROM Habilidades h WHERE h.postulante.idPostulante = :postulanteId AND h.habilidadTecnica.idHabilidad = :habilidadTecnicaId")
    boolean existsByPostulanteAndHabilidadTecnica(@Param("postulanteId") Integer postulanteId, @Param("habilidadTecnicaId") Integer habilidadTecnicaId);

    @Query("SELECT COUNT(h) > 0 FROM Habilidades h WHERE h.postulante.idPostulante = :postulanteId AND h.habilidadTecnica.idHabilidad = :habilidadTecnicaId AND h.id != :habilidadId")
    boolean existsByPostulanteAndHabilidadTecnicaExcludingCurrent(@Param("postulanteId") Integer postulanteId, @Param("habilidadTecnicaId") Integer habilidadTecnicaId, @Param("habilidadId") Integer habilidadId);
}
