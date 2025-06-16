package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.AplicacionEmpresaDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.AplicacionOferta;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.AplicacionOfertaId;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.AplicacionOfertaRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.PostulanteEmpresaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class EmpresaAplicacionOfertaService {
    @Autowired
    private PostulanteEmpresaRepository postulanteEmpresaRepository;

    @Autowired
    private AplicacionOfertaRepository aplicacionOfertaRepository;

    private final List<String> ESTADOS_VALIDOS = Arrays.asList("pendiente", "revision", "rechazado", "aceptado");

    public Page<AplicacionEmpresaDTO> obtenerPostulantesPorEmpresa(Integer empresaId, Pageable pageable) {
        return postulanteEmpresaRepository.findPostulantesByEmpresa(empresaId, pageable);
    }

    public Page<AplicacionEmpresaDTO> obtenerPostulantesPorEmpresaYOferta(
            Integer empresaId,
            Integer ofertaId,
            Pageable pageable) {
        return postulanteEmpresaRepository.findPostulantesbyEmpresaAndOferta(empresaId, ofertaId, pageable);
    }

    public Page<AplicacionEmpresaDTO> obtenerPostulantesConFiltros(
            Integer empresaId,
            Integer ofertaId,
            String estadoAplicacion,
            Pageable pageable) {

        // Validar estado si se proporciona
        if (estadoAplicacion != null && !ESTADOS_VALIDOS.contains(estadoAplicacion)) {
            throw new RuntimeException("Estado de aplicación no válido: " + estadoAplicacion);
        }

        return postulanteEmpresaRepository.findPostulantesWithFilters(
                empresaId,
                ofertaId,
                estadoAplicacion,
                pageable
        );
    }

    @Transactional
    public void actualizarEstadoAplicacion(Integer ofertaId, Integer postulanteId, String nuevoEstado) {
        // Validar estado
        if (!ESTADOS_VALIDOS.contains(nuevoEstado)) {
            throw new RuntimeException("Estado de aplicación no válido: " + nuevoEstado);
        }

        // Crear el ID compuesto
        AplicacionOfertaId aplicacionId = new AplicacionOfertaId();
        aplicacionId.setOfertaLaboral(ofertaId);
        aplicacionId.setPostulante(postulanteId);

        // Buscar la aplicación
        AplicacionOferta aplicacion = aplicacionOfertaRepository.findById(aplicacionId)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada"));

        // Actualizar estado
        aplicacion.setEstadoAplicacion(nuevoEstado);
        aplicacionOfertaRepository.save(aplicacion);
    }

    public List<String> obtenerEstadosValidos() {
        return ESTADOS_VALIDOS;
    }
}
