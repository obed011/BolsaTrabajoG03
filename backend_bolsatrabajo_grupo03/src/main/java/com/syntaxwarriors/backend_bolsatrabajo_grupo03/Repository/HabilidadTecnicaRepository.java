package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.HabilidadTecnica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HabilidadTecnicaRepository extends JpaRepository<HabilidadTecnica, Integer> {

    @Query("SELECT ht FROM HabilidadTecnica ht WHERE ht.categoriaHabilidad.idCategoriaHab = :categoriaId")
    List<HabilidadTecnica> findByCategoriaHabilidadId(@Param("categoriaId") Integer categoriaId);
}
