package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.AplicacionOferta;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.AplicacionOfertaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AplicacionOfertaRepository extends JpaRepository<AplicacionOferta, AplicacionOfertaId> {

    @Query("SELECT COUNT(a) > 0 FROM AplicacionOferta a WHERE a.ofertaLaboral.idOferta = :ofertaId AND a.postulante.idPostulante = :postulanteId")
    boolean existsByOfertaIdAndPostulanteId(@Param("ofertaId") Integer ofertaId, @Param("postulanteId") Integer postulanteId);

    @Query("SELECT a FROM AplicacionOferta a WHERE a.postulante.idPostulante = :postulanteId ORDER BY a.fechaAplicacion DESC")
    List<AplicacionOferta> findByPostulanteIdOrderByFechaAplicacionDesc(@Param("postulanteId") Integer postulanteId);

    @Query("SELECT a FROM AplicacionOferta a WHERE a.ofertaLaboral.idOferta = :ofertaId ORDER BY a.fechaAplicacion DESC")
    List<AplicacionOferta> findByOfertaIdOrderByFechaAplicacionDesc(@Param("ofertaId") Integer ofertaId);



}