package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.OfertaLaboral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OfertaLaboralRepository extends JpaRepository<OfertaLaboral, Integer> {

    @Query("SELECT o FROM OfertaLaboral o WHERE o.empresa.idEmpresa = :empresaId ORDER BY o.fechaPublicacion DESC")
    List<OfertaLaboral> findByEmpresaIdOrderByFechaPublicacionDesc(@Param("empresaId") Integer empresaId);

    @Query("SELECT o FROM OfertaLaboral o WHERE o.empresa.idEmpresa = :empresaId AND o.idOferta = :ofertaId")
    OfertaLaboral findByEmpresaIdAndOfertaId(@Param("empresaId") Integer empresaId, @Param("ofertaId") Integer ofertaId);

    @Query("SELECT o FROM OfertaLaboral o WHERE o.fechaExpiracion >= CURRENT_DATE ORDER BY o.fechaPublicacion DESC")
    List<OfertaLaboral> findActiveOfertasOrderByFechaPublicacionDesc();

    @Query("SELECT o FROM OfertaLaboral o WHERE o.categoriaOferta.idCatOferta = :categoriaId AND o.fechaExpiracion >= CURRENT_DATE ORDER BY o.fechaPublicacion DESC")
    List<OfertaLaboral> findActiveByCategoriaIdOrderByFechaPublicacionDesc(@Param("categoriaId") Integer categoriaId);

    @Query("SELECT o FROM OfertaLaboral o WHERE o.idOferta = :ofertaId AND o.fechaExpiracion >= CURRENT_DATE")
    OfertaLaboral findActiveOfertaById(@Param("ofertaId") Integer ofertaId);
}
