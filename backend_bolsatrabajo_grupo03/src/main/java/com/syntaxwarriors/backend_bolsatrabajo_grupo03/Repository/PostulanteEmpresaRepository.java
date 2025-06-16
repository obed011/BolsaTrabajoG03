package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.AplicacionEmpresaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.AplicacionOferta;

@Repository
public interface PostulanteEmpresaRepository extends JpaRepository<AplicacionOferta, Object> {

    @Query(value = """
        SELECT new com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.AplicacionEmpresaDTO(
            v.idEmpresa,
            v.idOferta,
            v.tituloOferta,
            v.idPostulante,
            v.nombrePostulante,
            v.correo,
            v.telCelular,
            v.direccionPost,
            v.fechaAplicacion,
            v.estadoAplicacion,
            v.habilidadesMatch,
            v.totalHabilidadesRequeridas,
            v.formacionMatch,
            v.experienciaMatch,
            v.puntaje
        )
        FROM VwPostulantesEmpresa v
        WHERE v.idEmpresa = :empresaId
        ORDER BY v.fechaAplicacion DESC
        """)
    Page<AplicacionEmpresaDTO> findPostulantesByEmpresa(
            @Param("empresaId") Integer empresaId,
            Pageable pageable
    );

    @Query(value = """
        SELECT new com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.AplicacionEmpresaDTO(
            v.idEmpresa,
            v.idOferta,
            v.tituloOferta,
            v.idPostulante,
            v.nombrePostulante,
            v.correo,
            v.telCelular,
            v.direccionPost,
            v.fechaAplicacion,
            v.estadoAplicacion,
            v.habilidadesMatch,
            v.totalHabilidadesRequeridas,
            v.formacionMatch,
            v.experienciaMatch,
            v.puntaje
        )
        FROM VwPostulantesEmpresa v
        WHERE v.idEmpresa = :empresaId 
        AND v.idOferta = :ofertaId
        ORDER BY v.puntaje DESC, v.fechaAplicacion DESC
        """)
    Page<AplicacionEmpresaDTO> findPostulantesbyEmpresaAndOferta(
            @Param("empresaId") Integer empresaId,
            @Param("ofertaId") Integer ofertaId,
            Pageable pageable
    );

    @Query(value = """
        SELECT new com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.AplicacionEmpresaDTO(
            v.idEmpresa,
            v.idOferta,
            v.tituloOferta,
            v.idPostulante,
            v.nombrePostulante,
            v.correo,
            v.telCelular,
            v.direccionPost,
            v.fechaAplicacion,
            v.estadoAplicacion,
            v.habilidadesMatch,
            v.totalHabilidadesRequeridas,
            v.formacionMatch,
            v.experienciaMatch,
            v.puntaje
        )
        FROM VwPostulantesEmpresa v
        WHERE v.idEmpresa = :empresaId 
        AND (:ofertaId IS NULL OR v.idOferta = :ofertaId)
        AND (:estadoAplicacion IS NULL OR v.estadoAplicacion = :estadoAplicacion)
        ORDER BY v.puntaje DESC, v.fechaAplicacion DESC
        """)
    Page<AplicacionEmpresaDTO> findPostulantesWithFilters(
            @Param("empresaId") Integer empresaId,
            @Param("ofertaId") Integer ofertaId,
            @Param("estadoAplicacion") String estadoAplicacion,
            Pageable pageable
    );
}