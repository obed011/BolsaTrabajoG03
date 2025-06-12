package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.*;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.*;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FormacionAcademicaService {

    @Autowired
    private FormacionAcademicaRepository formacionAcademicaRepository;

    @Autowired
    private PostulanteRepository postulanteRepository;

    @Autowired
    private EspecialidadAcademicaRepository especialidadAcademicaRepository;

    public List<FormacionAcademicaDTO> obtenerTodas() {
        return formacionAcademicaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<FormacionAcademicaDTO> obtenerPorPostulante(Integer idPostulante) {
        return formacionAcademicaRepository.findByPostulanteId(idPostulante).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public Optional<FormacionAcademicaDTO> obtenerPorId(Integer id) {
        return formacionAcademicaRepository.findById(id)
                .map(this::convertirADTO);
    }

    public FormacionAcademicaDTO crear(FormacionAcademicaCreateUpdateDTO dto) {
        // Validar que el postulante existe
        Postulante postulante = postulanteRepository.findById(dto.getIdPostulante())
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        // Validar que la especialidad existe
        EspecialidadAcademica especialidad = especialidadAcademicaRepository.findById(dto.getIdEspecialidad())
                .orElseThrow(() -> new RuntimeException("Especialidad académica no encontrada"));

        FormacionAcademica formacion = new FormacionAcademica();
        formacion.setNombreInstitucion(dto.getNombreInstitucion());
        formacion.setInicioFormacion(dto.getInicioFormacion());
        formacion.setFinFormacion(dto.getFinFormacion());
        formacion.setEnCurso(dto.getEnCurso());
        formacion.setPostulante(postulante);
        formacion.setEspecialidadAcademica(especialidad);

        FormacionAcademica guardada = formacionAcademicaRepository.save(formacion);
        return convertirADTO(guardada);
    }

    public FormacionAcademicaDTO actualizar(Integer id, FormacionAcademicaCreateUpdateDTO dto) {
        FormacionAcademica formacion = formacionAcademicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formación académica no encontrada"));

        // Validar que el postulante existe
        Postulante postulante = postulanteRepository.findById(dto.getIdPostulante())
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        // Validar que la especialidad existe
        EspecialidadAcademica especialidad = especialidadAcademicaRepository.findById(dto.getIdEspecialidad())
                .orElseThrow(() -> new RuntimeException("Especialidad académica no encontrada"));

        formacion.setNombreInstitucion(dto.getNombreInstitucion());
        formacion.setInicioFormacion(dto.getInicioFormacion());
        formacion.setFinFormacion(dto.getFinFormacion());
        formacion.setEnCurso(dto.getEnCurso());
        formacion.setPostulante(postulante);
        formacion.setEspecialidadAcademica(especialidad);

        FormacionAcademica actualizada = formacionAcademicaRepository.save(formacion);
        return convertirADTO(actualizada);
    }

    public void eliminar(Integer id) {
        if (!formacionAcademicaRepository.existsById(id)) {
            throw new RuntimeException("Formación académica no encontrada");
        }
        formacionAcademicaRepository.deleteById(id);
    }

    private FormacionAcademicaDTO convertirADTO(FormacionAcademica formacion) {
        FormacionAcademicaDTO dto = new FormacionAcademicaDTO();
        dto.setIdFormacion(formacion.getIdFormacion());
        dto.setNombreInstitucion(formacion.getNombreInstitucion());
        dto.setInicioFormacion(formacion.getInicioFormacion());
        dto.setFinFormacion(formacion.getFinFormacion());
        dto.setEnCurso(formacion.getEnCurso());
        dto.setIdPostulante(formacion.getPostulante().getIdPostulante());
        dto.setIdEspecialidad(formacion.getEspecialidadAcademica().getIdEspecialidad());
        dto.setNombreEspecialidad(formacion.getEspecialidadAcademica().getNomEsp());
        dto.setIdNivelAcademico(formacion.getEspecialidadAcademica().getNivelAcademico().getIdNivAcademico());
        dto.setNombreNivelAcademico(formacion.getEspecialidadAcademica().getNivelAcademico().getNomNivel());
        dto.setFyhCreacion(formacion.getFyhCreacion());
        dto.setFyhActualizacion(formacion.getFyhActualizacion());
        return dto;
    }
}
