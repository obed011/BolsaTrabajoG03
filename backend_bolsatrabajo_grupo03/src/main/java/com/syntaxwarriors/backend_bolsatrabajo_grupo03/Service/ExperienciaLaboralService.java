package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.ExperienciaLaboralDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.ExperienciaLaboralCreateDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.CategoriaPuestoDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.CategoriaPuesto;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.ExperienciaLaboral;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Postulante;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.ExperienciaLaboralRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.CategoriaPuestoRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.PostulanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExperienciaLaboralService {

    private final ExperienciaLaboralRepository experienciaLaboralRepository;
    private final CategoriaPuestoRepository categoriaPuestoRepository;
    private final PostulanteRepository postulanteRepository;

    public List<ExperienciaLaboralDTO> obtenerExperienciasPorPostulante(Integer idPostulante) {
        List<ExperienciaLaboral> experiencias = experienciaLaboralRepository
                .findByIdPostulanteWithCategoria(idPostulante);

        return experiencias.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public Optional<ExperienciaLaboralDTO> obtenerExperienciaPorId(Integer id) {
        return experienciaLaboralRepository.findById(id)
                .map(this::convertirADTO);
    }

    public ExperienciaLaboralDTO crearExperiencia(ExperienciaLaboralCreateDTO createDTO) {
        // Validar que existe la categoría
        CategoriaPuesto categoria = categoriaPuestoRepository.findById(createDTO.getIdPuesto())
                .orElseThrow(() -> new RuntimeException("Categoría de puesto no encontrada"));

        // Validar fechas
        if (createDTO.getFinExp() != null &&
                createDTO.getInicioExp().isAfter(createDTO.getFinExp())) {
            throw new RuntimeException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        // Si es trabajo actual, la fecha fin debe ser null
        if (Boolean.TRUE.equals(createDTO.getTrabajoActual())) {
            createDTO.setFinExp(null);
        }

        ExperienciaLaboral experiencia = new ExperienciaLaboral();
        experiencia.setNomOrganizacion(createDTO.getNomOrganizacion());
        experiencia.setNomPuesto(createDTO.getNomPuesto());
        experiencia.setFunciones(createDTO.getFunciones());
        experiencia.setContactoOrganizacion(createDTO.getContactoOrganizacion());
        experiencia.setInicioExp(createDTO.getInicioExp());
        experiencia.setFinExp(createDTO.getFinExp());
        experiencia.setTrabajoActual(createDTO.getTrabajoActual());
        experiencia.setCategoriaPuesto(categoria);
        Postulante postulante = postulanteRepository.findById(createDTO.getIdPostulante())
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));
        experiencia.setPostulante(postulante);

        ExperienciaLaboral experienciaGuardada = experienciaLaboralRepository.save(experiencia);
        return convertirADTO(experienciaGuardada);
    }

    public ExperienciaLaboralDTO actualizarExperiencia(Integer id, ExperienciaLaboralCreateDTO updateDTO) {
        ExperienciaLaboral experiencia = experienciaLaboralRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experiencia laboral no encontrada"));

        // Validar que existe la categoría
        CategoriaPuesto categoria = categoriaPuestoRepository.findById(updateDTO.getIdPuesto())
                .orElseThrow(() -> new RuntimeException("Categoría de puesto no encontrada"));

        // Validar fechas
        if (updateDTO.getFinExp() != null &&
                updateDTO.getInicioExp().isAfter(updateDTO.getFinExp())) {
            throw new RuntimeException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        // Si es trabajo actual, la fecha fin debe ser null
        if (Boolean.TRUE.equals(updateDTO.getTrabajoActual())) {
            updateDTO.setFinExp(null);
        }

        experiencia.setNomOrganizacion(updateDTO.getNomOrganizacion());
        experiencia.setNomPuesto(updateDTO.getNomPuesto());
        experiencia.setFunciones(updateDTO.getFunciones());
        experiencia.setContactoOrganizacion(updateDTO.getContactoOrganizacion());
        experiencia.setInicioExp(updateDTO.getInicioExp());
        experiencia.setFinExp(updateDTO.getFinExp());
        experiencia.setTrabajoActual(updateDTO.getTrabajoActual());
        experiencia.setCategoriaPuesto(categoria);

        ExperienciaLaboral experienciaActualizada = experienciaLaboralRepository.save(experiencia);
        return convertirADTO(experienciaActualizada);
    }

    public void eliminarExperiencia(Integer id) {
        if (!experienciaLaboralRepository.existsById(id)) {
            throw new RuntimeException("Experiencia laboral no encontrada");
        }
        experienciaLaboralRepository.deleteById(id);
    }

    public List<CategoriaPuestoDTO> obtenerTodasLasCategorias() {
        return categoriaPuestoRepository.findAll().stream()
                .map(categoria -> new CategoriaPuestoDTO(
                        categoria.getIdPuesto(),
                        categoria.getNombreCategoria()
                ))
                .collect(Collectors.toList());
    }

    private ExperienciaLaboralDTO convertirADTO(ExperienciaLaboral experiencia) {
        ExperienciaLaboralDTO dto = new ExperienciaLaboralDTO();
        dto.setIdExperiencia(experiencia.getIdExperiencia());
        dto.setNomOrganizacion(experiencia.getNomOrganizacion());
        dto.setNomPuesto(experiencia.getNomPuesto());
        dto.setFunciones(experiencia.getFunciones());
        dto.setContactoOrganizacion(experiencia.getContactoOrganizacion());
        dto.setInicioExp(experiencia.getInicioExp());
        dto.setFinExp(experiencia.getFinExp());
        dto.setTrabajoActual(experiencia.getTrabajoActual());
        if (experiencia.getPostulante() != null) {
            dto.setIdPostulante(experiencia.getPostulante().getIdPostulante());
        }

        if (experiencia.getCategoriaPuesto() != null) {
            dto.setIdPuesto(experiencia.getCategoriaPuesto().getIdPuesto());
            dto.setNombreCategoria(experiencia.getCategoriaPuesto().getNombreCategoria());
        }

        return dto;
    }
}
