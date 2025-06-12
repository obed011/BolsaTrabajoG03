package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.FormacionAcademica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FormacionAcademicaRepository extends JpaRepository<FormacionAcademica, Integer> {

    @Query("SELECT f FROM FormacionAcademica f WHERE f.postulante.idPostulante = :idPostulante")
    List<FormacionAcademica> findByPostulanteId(@Param("idPostulante") Integer idPostulante);
}