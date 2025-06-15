package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.OfertaLaboralDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.RqExperienciaDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.*;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OfertaLaboralService {

    @Autowired
    private OfertaLaboralRepository ofertaLaboralRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private CategoriaOfertaRepository categoriaOfertaRepository;

    @Autowired
    private RqExperienciaRepository rqExperienciaRepository;

    @Autowired
    private CategoriaPuestoRepository categoriaPuestoRepository;

    @Autowired
    private HabilidadTecnicaRepository habilidadTecnicaRepository;

    @Autowired
    private EspecialidadAcademicaRepository especialidadAcademicaRepository;

    public List<OfertaLaboralDTO> obtenerOfertasPorEmpresa(Integer empresaId) {
        List<OfertaLaboral> ofertas = ofertaLaboralRepository.findByEmpresaIdOrderByFechaPublicacionDesc(empresaId);
        return ofertas.stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    public OfertaLaboralDTO obtenerOfertaPorId(Integer empresaId, Integer ofertaId) {
        OfertaLaboral oferta = ofertaLaboralRepository.findByEmpresaIdAndOfertaId(empresaId, ofertaId);
        if (oferta == null) {
            throw new RuntimeException("Oferta no encontrada o no pertenece a la empresa");
        }
        return convertirADTO(oferta);
    }

    public OfertaLaboralDTO crearOferta(OfertaLaboralDTO ofertaDTO) {
        // Validar que la empresa existe
        Empresa empresa = empresaRepository.findById(ofertaDTO.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        // Validar que la categoria existe
        CategoriaOferta categoriaOferta = categoriaOfertaRepository.findById(ofertaDTO.getIdCategoriaOferta())
                .orElseThrow(() -> new RuntimeException("Categoria de oferta no encontrada"));

        OfertaLaboral nuevaOferta = new OfertaLaboral();
        nuevaOferta.setEmpresa(empresa);
        nuevaOferta.setCategoriaOferta(categoriaOferta);
        nuevaOferta.setTituloOferta(ofertaDTO.getTituloOferta());
        nuevaOferta.setDescripcionOferta(ofertaDTO.getDescripcionOferta());
        nuevaOferta.setSalario(ofertaDTO.getSalario());
        nuevaOferta.setUbicacion(ofertaDTO.getUbicacion());
        nuevaOferta.setModalidad(ofertaDTO.getModalidad());
        nuevaOferta.setFechaExpiracion(ofertaDTO.getFechaExpiracion());
        nuevaOferta.setFechaPublicacion(LocalDate.now());
        nuevaOferta.setFyhCreacionOf(LocalDate.now());

        // Guardar la oferta primero
        OfertaLaboral ofertaGuardada = ofertaLaboralRepository.save(nuevaOferta);

        // Agregar requerimientos de experiencia
        if (ofertaDTO.getRequerimientosExperiencia() != null) {
            for (RqExperienciaDTO rqDto : ofertaDTO.getRequerimientosExperiencia()) {
                CategoriaPuesto categoriaPuesto = categoriaPuestoRepository.findById(rqDto.getIdCategoriaPuesto())
                        .orElseThrow(() -> new RuntimeException("Categoria de puesto no encontrada"));

                RqExperiencia rqExperiencia = new RqExperiencia();
                rqExperiencia.setOfertaLaboral(ofertaGuardada);
                rqExperiencia.setCategoriaPuesto(categoriaPuesto);
                rqExperiencia.setPuestoRq(rqDto.getPuestoRq());
                rqExperiencia.setAnosExp(rqDto.getAnosExp());

                rqExperienciaRepository.save(rqExperiencia);
            }
        }

        // Agregar habilidades requeridas
        if (ofertaDTO.getHabilidadesRequeridas() != null && !ofertaDTO.getHabilidadesRequeridas().isEmpty()) {
            List<HabilidadTecnica> habilidades = habilidadTecnicaRepository.findAllById(ofertaDTO.getHabilidadesRequeridas());
            ofertaGuardada.setHabilidadesRequeridas(habilidades);
        }

        // Agregar especialidades requeridas
        if (ofertaDTO.getEspecialidadesRequeridas() != null && !ofertaDTO.getEspecialidadesRequeridas().isEmpty()) {
            List<EspecialidadAcademica> especialidades = especialidadAcademicaRepository.findAllById(ofertaDTO.getEspecialidadesRequeridas());
            ofertaGuardada.setEspecialidadesRequeridas(especialidades);
        }

        // Guardar nuevamente con las relaciones
        ofertaGuardada = ofertaLaboralRepository.save(ofertaGuardada);

        return convertirADTO(ofertaGuardada);
    }

    public OfertaLaboralDTO actualizarOferta(Integer empresaId, Integer ofertaId, OfertaLaboralDTO ofertaDTO) {
        OfertaLaboral ofertaExistente = ofertaLaboralRepository.findByEmpresaIdAndOfertaId(empresaId, ofertaId);
        if (ofertaExistente == null) {
            throw new RuntimeException("Oferta no encontrada o no pertenece a la empresa");
        }

        // Actualizar campos básicos
        if (ofertaDTO.getIdCategoriaOferta() != null) {
            CategoriaOferta categoriaOferta = categoriaOfertaRepository.findById(ofertaDTO.getIdCategoriaOferta())
                    .orElseThrow(() -> new RuntimeException("Categoria de oferta no encontrada"));
            ofertaExistente.setCategoriaOferta(categoriaOferta);
        }

        if (ofertaDTO.getTituloOferta() != null) {
            ofertaExistente.setTituloOferta(ofertaDTO.getTituloOferta());
        }
        if (ofertaDTO.getDescripcionOferta() != null) {
            ofertaExistente.setDescripcionOferta(ofertaDTO.getDescripcionOferta());
        }
        if (ofertaDTO.getSalario() != null) {
            ofertaExistente.setSalario(ofertaDTO.getSalario());
        }
        if (ofertaDTO.getUbicacion() != null) {
            ofertaExistente.setUbicacion(ofertaDTO.getUbicacion());
        }
        if (ofertaDTO.getModalidad() != null) {
            ofertaExistente.setModalidad(ofertaDTO.getModalidad());
        }
        if (ofertaDTO.getFechaExpiracion() != null) {
            ofertaExistente.setFechaExpiracion(ofertaDTO.getFechaExpiracion());
        }

        ofertaExistente.setFyhActualizacionOf(LocalDate.now());

        // Actualizar requerimientos de experiencia si se proporcionan
        if (ofertaDTO.getRequerimientosExperiencia() != null) {
            if (ofertaExistente.getRequerimientosExperiencia() != null) {
                rqExperienciaRepository.deleteAll(ofertaExistente.getRequerimientosExperiencia());
                ofertaExistente.getRequerimientosExperiencia().clear();
            }

            for (RqExperienciaDTO rqDto : ofertaDTO.getRequerimientosExperiencia()) {
                CategoriaPuesto categoriaPuesto = categoriaPuestoRepository.findById(rqDto.getIdCategoriaPuesto())
                        .orElseThrow(() -> new RuntimeException("Categoria de puesto no encontrada"));

                RqExperiencia rqExperiencia = new RqExperiencia();
                rqExperiencia.setOfertaLaboral(ofertaExistente);
                rqExperiencia.setCategoriaPuesto(categoriaPuesto);
                rqExperiencia.setPuestoRq(rqDto.getPuestoRq());
                rqExperiencia.setAnosExp(rqDto.getAnosExp());

                rqExperienciaRepository.save(rqExperiencia);
            }
        }


        // Actualizar habilidades si se proporcionan
        if (ofertaDTO.getHabilidadesRequeridas() != null) {
            List<HabilidadTecnica> habilidades = habilidadTecnicaRepository.findAllById(ofertaDTO.getHabilidadesRequeridas());
            ofertaExistente.setHabilidadesRequeridas(habilidades);
        }

        // Actualizar especialidades si se proporcionan
        if (ofertaDTO.getEspecialidadesRequeridas() != null) {
            List<EspecialidadAcademica> especialidades = especialidadAcademicaRepository.findAllById(ofertaDTO.getEspecialidadesRequeridas());
            ofertaExistente.setEspecialidadesRequeridas(especialidades);
        }

        OfertaLaboral ofertaActualizada = ofertaLaboralRepository.save(ofertaExistente);
        return convertirADTO(ofertaActualizada);
    }

    public void eliminarOferta(Integer empresaId, Integer ofertaId) {
        OfertaLaboral oferta = ofertaLaboralRepository.findByEmpresaIdAndOfertaId(empresaId, ofertaId);
        if (oferta == null) {
            throw new RuntimeException("Oferta no encontrada o no pertenece a la empresa");
        }
        ofertaLaboralRepository.delete(oferta);
    }

    private OfertaLaboralDTO convertirADTO(OfertaLaboral oferta) {
        OfertaLaboralDTO dto = new OfertaLaboralDTO();
        dto.setIdOferta(oferta.getIdOferta());
        dto.setIdEmpresa(oferta.getEmpresa().getIdEmpresa());
        dto.setIdCategoriaOferta(oferta.getCategoriaOferta().getIdCatOferta());
        dto.setNombreCategoriaOferta(oferta.getCategoriaOferta().getNomCatOferta());
        dto.setTituloOferta(oferta.getTituloOferta());
        dto.setDescripcionOferta(oferta.getDescripcionOferta());
        dto.setSalario(oferta.getSalario());
        dto.setUbicacion(oferta.getUbicacion());
        dto.setModalidad(oferta.getModalidad());
        dto.setFechaExpiracion(oferta.getFechaExpiracion());
        dto.setFechaPublicacion(oferta.getFechaPublicacion());

        // Convertir requerimientos de experiencia
        if (oferta.getRequerimientosExperiencia() != null) {
            dto.setRequerimientosExperiencia(
                    oferta.getRequerimientosExperiencia().stream()
                            .map(this::convertirRqExperienciaADTO)
                            .collect(Collectors.toList())
            );
        }

        // Convertir habilidades
        if (oferta.getHabilidadesRequeridas() != null) {
            dto.setHabilidadesRequeridas(
                    oferta.getHabilidadesRequeridas().stream()
                            .map(HabilidadTecnica::getIdHabilidad)
                            .collect(Collectors.toList())
            );
        }

        // Convertir especialidades
        if (oferta.getEspecialidadesRequeridas() != null) {
            dto.setEspecialidadesRequeridas(
                    oferta.getEspecialidadesRequeridas().stream()
                            .map(EspecialidadAcademica::getIdEspecialidad)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    private RqExperienciaDTO convertirRqExperienciaADTO(RqExperiencia rq) {
        RqExperienciaDTO dto = new RqExperienciaDTO();
        dto.setIdRqExperiencia(rq.getIdRqExperiencia());
        dto.setIdCategoriaPuesto(rq.getCategoriaPuesto().getIdPuesto());
        dto.setNombreCategoria(rq.getCategoriaPuesto().getNombreCategoria());
        dto.setPuestoRq(rq.getPuestoRq());
        dto.setAnosExp(rq.getAnosExp());
        return dto;
    }
}