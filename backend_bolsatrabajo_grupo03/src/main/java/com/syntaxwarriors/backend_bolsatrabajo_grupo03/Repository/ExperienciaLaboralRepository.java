package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.ExperienciaLaboral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExperienciaLaboralRepository extends JpaRepository<ExperienciaLaboral, Integer> {

    @Query("SELECT e FROM ExperienciaLaboral e WHERE e.postulante.idPostulante = :idPostulante ORDER BY e.fhCreacion DESC")
    List<ExperienciaLaboral> findByIdPostulanteOrderByFhCreacionDesc(@Param("idPostulante") Integer idPostulante);

    @Query("SELECT e FROM ExperienciaLaboral e JOIN FETCH e.categoriaPuesto WHERE e.postulante.idPostulante = :idPostulante ORDER BY e.fhCreacion DESC")
    List<ExperienciaLaboral> findByIdPostulanteWithCategoria(@Param("idPostulante") Integer idPostulante);
}