package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.EspecialidadAcademica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EspecialidadAcademicaRepository extends JpaRepository<EspecialidadAcademica, Integer> {

    @Query("SELECT e FROM EspecialidadAcademica e WHERE e.nivelAcademico.idNivAcademico = :idNivelAcademico")
    List<EspecialidadAcademica> findByNivelAcademicoId(@Param("idNivelAcademico") Integer idNivelAcademico);
}
