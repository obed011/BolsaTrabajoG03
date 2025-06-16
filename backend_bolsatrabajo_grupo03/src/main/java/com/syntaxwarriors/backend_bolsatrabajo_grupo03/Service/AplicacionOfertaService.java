package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.AplicacionOfertaDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.OfertaLaboralDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.RqExperienciaDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.AplicacionOferta;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.OfertaLaboral;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Postulante;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.AplicacionOfertaRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.OfertaLaboralRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.PostulanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AplicacionOfertaService {

    @Autowired
    private AplicacionOfertaRepository aplicacionOfertaRepository;

    @Autowired
    private OfertaLaboralRepository ofertaLaboralRepository;

    @Autowired
    private PostulanteRepository postulanteRepository;

    public List<OfertaLaboralDTO> obtenerOfertasActivas() {
        List<OfertaLaboral> ofertas = ofertaLaboralRepository.findActiveOfertasOrderByFechaPublicacionDesc();
        return ofertas.stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    public List<OfertaLaboralDTO> obtenerOfertasPorCategoria(Integer categoriaId) {
        List<OfertaLaboral> ofertas = ofertaLaboralRepository.findActiveByCategoriaIdOrderByFechaPublicacionDesc(categoriaId);
        return ofertas.stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    public OfertaLaboralDTO obtenerDetalleOferta(Integer ofertaId) {
        OfertaLaboral oferta = ofertaLaboralRepository.findActiveOfertaById(ofertaId);
        if (oferta == null) {
            throw new RuntimeException("Oferta no encontrada o expirada");
        }
        return convertirADTO(oferta);
    }

    @Transactional
    public AplicacionOfertaDTO aplicarAOferta(Integer ofertaId, Integer postulanteId) {
        // Verificar que la oferta existe y está activa
        OfertaLaboral oferta = ofertaLaboralRepository.findActiveOfertaById(ofertaId);
        if (oferta == null) {
            throw new RuntimeException("Oferta no encontrada o expirada");
        }

        // Verificar que el postulante existe
        Postulante postulante = postulanteRepository.findById(postulanteId)
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        // Verificar que no haya aplicado anteriormente
        if (aplicacionOfertaRepository.existsByOfertaIdAndPostulanteId(ofertaId, postulanteId)) {
            throw new RuntimeException("Ya has aplicado a esta oferta");
        }

        // Crear la aplicación
        AplicacionOferta aplicacion = new AplicacionOferta();
        aplicacion.setOfertaLaboral(oferta);
        aplicacion.setPostulante(postulante);

        AplicacionOferta aplicacionGuardada = aplicacionOfertaRepository.save(aplicacion);

        return convertirAplicacionADTO(aplicacionGuardada);
    }

    public List<AplicacionOfertaDTO> obtenerAplicacionesPostulante(Integer postulanteId) {
        List<AplicacionOferta> aplicaciones = aplicacionOfertaRepository.findByPostulanteIdOrderByFechaAplicacionDesc(postulanteId);
        return aplicaciones.stream().map(this::convertirAplicacionADTO).collect(Collectors.toList());
    }

    public boolean haAplicado(Integer ofertaId, Integer postulanteId) {
        return aplicacionOfertaRepository.existsByOfertaIdAndPostulanteId(ofertaId, postulanteId);
    }

    private OfertaLaboralDTO convertirADTO(OfertaLaboral oferta) {
        OfertaLaboralDTO dto = new OfertaLaboralDTO();
        dto.setIdOferta(oferta.getIdOferta());
        dto.setIdEmpresa(oferta.getEmpresa().getIdEmpresa());
        dto.setIdCategoriaOferta(oferta.getCategoriaOferta().getIdCatOferta());
        dto.setTituloOferta(oferta.getTituloOferta());
        dto.setDescripcionOferta(oferta.getDescripcionOferta());
        dto.setSalario(oferta.getSalario());
        dto.setUbicacion(oferta.getUbicacion());
        dto.setModalidad(oferta.getModalidad());
        dto.setFechaExpiracion(oferta.getFechaExpiracion());
        dto.setFechaPublicacion(oferta.getFechaPublicacion());
        dto.setNombreCategoriaOferta(oferta.getCategoriaOferta().getNomCatOferta());
        dto.setNombreEmpresa(oferta.getEmpresa().getNombreEmpresa());

        dto.setRequerimientosExperiencia(
                oferta.getRequerimientosExperiencia().stream()
                        .map(rq -> {
                            RqExperienciaDTO expDTO = new RqExperienciaDTO();
                            expDTO.setIdRqExperiencia(rq.getIdRqExperiencia());
                            expDTO.setIdCategoriaPuesto(rq.getCategoriaPuesto().getIdPuesto());
                            expDTO.setPuestoRq(rq.getPuestoRq());
                            expDTO.setAnosExp(rq.getAnosExp());
                            expDTO.setNombreCategoria(rq.getCategoriaPuesto().getNombreCategoria());
                            return expDTO;
                        })
                        .collect(Collectors.toList())
        );


        // Habilidades requeridas (solo IDs)
        if (oferta.getHabilidadesRequeridas() != null) {
            dto.setHabilidadesRequeridas(
                    oferta.getHabilidadesRequeridas().stream()
                            .map(h -> h.getIdHabilidad())
                            .collect(Collectors.toList())
            );
        }

        // Especialidades requeridas (solo IDs)
        if (oferta.getEspecialidadesRequeridas() != null) {
            dto.setEspecialidadesRequeridas(
                    oferta.getEspecialidadesRequeridas().stream()
                            .map(e -> e.getIdEspecialidad())
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    private AplicacionOfertaDTO convertirAplicacionADTO(AplicacionOferta aplicacion) {
        AplicacionOfertaDTO dto = new AplicacionOfertaDTO();
        dto.setIdOferta(aplicacion.getOfertaLaboral().getIdOferta());
        dto.setIdPostulante(aplicacion.getPostulante().getIdPostulante());
        dto.setFechaAplicacion(aplicacion.getFechaAplicacion());
        dto.setEstadoAplicacion(aplicacion.getEstadoAplicacion());
        dto.setTituloOferta(aplicacion.getOfertaLaboral().getTituloOferta());
        dto.setNombreEmpresa(aplicacion.getOfertaLaboral().getEmpresa().getNombreEmpresa());
        dto.setNombrePostulante(aplicacion.getPostulante().getNombres() + " " + aplicacion.getPostulante().getApellidos());
        return dto;
    }
}